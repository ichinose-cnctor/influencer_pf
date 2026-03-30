from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from app.database import get_db
from app.models import User, Conversation, ConversationParticipant, Message, Notification
from app.schemas import MessageCreate, ConversationCreate
from app.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.get("/conversations")
def list_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participations = db.query(ConversationParticipant).filter(
        ConversationParticipant.user_id == current_user.id
    ).all()

    result = []
    for p in participations:
        conv = p.conversation
        # Get other participant
        other_participant = db.query(ConversationParticipant).filter(
            ConversationParticipant.conversation_id == conv.id,
            ConversationParticipant.user_id != current_user.id,
        ).first()
        other_user = db.query(User).filter(User.id == other_participant.user_id).first() if other_participant else None

        # Get last message
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()

        result.append({
            "id": conv.id,
            "campaign_id": conv.campaign_id,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "other_user": {
                "id": other_user.id, "email": other_user.email,
                "name": other_user.name, "role": other_user.role,
                "photo_url": other_user.photo_url, "created_at": other_user.created_at,
            } if other_user else None,
            "last_message": last_msg.text if last_msg else None,
            "last_time": last_msg.created_at if last_msg else None,
            "unread_count": p.unread_count,
        })

    result.sort(key=lambda x: x["last_time"] or x["created_at"], reverse=True)
    return result


@router.get("/conversations/{conv_id}")
def get_conversation(conv_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conv_id,
        ConversationParticipant.user_id == current_user.id,
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="会話が見つかりません")

    messages = db.query(Message).filter(
        Message.conversation_id == conv_id
    ).order_by(Message.created_at).all()

    return [{
        "id": m.id,
        "conversation_id": m.conversation_id,
        "sender_id": m.sender_id,
        "text": m.text,
        "is_read": m.is_read,
        "created_at": m.created_at,
    } for m in messages]


@router.post("/conversations/{conv_id}")
def send_message(conv_id: int, data: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conv_id,
        ConversationParticipant.user_id == current_user.id,
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="会話が見つかりません")

    msg = Message(conversation_id=conv_id, sender_id=current_user.id, text=data.text)
    db.add(msg)

    # Increment unread for other participants
    db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conv_id,
        ConversationParticipant.user_id != current_user.id,
    ).update({"unread_count": ConversationParticipant.unread_count + 1})

    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if conv:
        conv.updated_at = func.now()

    # 通知を生成 (メッセージ通知 -> 相手へ)
    others = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conv_id,
        ConversationParticipant.user_id != current_user.id,
    ).all()
    for other in others:
        notif = Notification(
            user_id=other.user_id,
            title="新規メッセージが届きました。",
            body=f"{current_user.name} さんからメッセージが届きました。",
            type="message",
            reference_id=conv_id
        )
        db.add(notif)

    db.commit()
    db.refresh(msg)
    return {
        "id": msg.id, "conversation_id": msg.conversation_id,
        "sender_id": msg.sender_id, "text": msg.text,
        "is_read": msg.is_read, "created_at": msg.created_at,
    }


@router.post("/conversations", status_code=201)
def create_conversation(data: ConversationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    other_user = db.query(User).filter(User.id == data.participant_id).first()
    if not other_user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    # Check if conversation already exists between these users
    existing = db.query(Conversation).join(ConversationParticipant).filter(
        ConversationParticipant.user_id == current_user.id
    ).all()
    for conv in existing:
        other = db.query(ConversationParticipant).filter(
            ConversationParticipant.conversation_id == conv.id,
            ConversationParticipant.user_id == data.participant_id,
        ).first()
        if other:
            return {"id": conv.id, "existing": True}

    conv = Conversation(campaign_id=data.campaign_id)
    db.add(conv)
    db.flush()

    db.add(ConversationParticipant(conversation_id=conv.id, user_id=current_user.id))
    db.add(ConversationParticipant(conversation_id=conv.id, user_id=data.participant_id))

    if data.initial_message:
        msg = Message(conversation_id=conv.id, sender_id=current_user.id, text=data.initial_message)
        db.add(msg)

    db.commit()
    db.refresh(conv)
    return {"id": conv.id, "existing": False}


@router.patch("/conversations/{conv_id}/read")
def mark_conversation_read(conv_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conv_id,
        ConversationParticipant.user_id == current_user.id,
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="会話が見つかりません")

    participant.unread_count = 0

    db.query(Message).filter(
        Message.conversation_id == conv_id,
        Message.sender_id != current_user.id,
        Message.is_read == False,
    ).update({"is_read": True})

    db.commit()
    return {"message": "既読にしました"}
