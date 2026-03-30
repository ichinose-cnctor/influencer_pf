import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.database import SessionLocal
from app.models import Campaign, CampaignMedia, Application, Conversation, ConversationParticipant, Message, InfluencerProfile, User
from sqlalchemy import delete

def reset_campaigns():
    db = SessionLocal()
    try:
        print("Resetting campaign data...")
        
        # 1. Delete Messages
        db.execute(delete(Message))
        print("Deleted all messages.")
        
        # 2. Delete Conversation Participants
        db.execute(delete(ConversationParticipant))
        print("Deleted all conversation participants.")
        
        # 3. Delete Conversations
        db.execute(delete(Conversation))
        print("Deleted all conversations.")
        
        # 4. Delete Applications
        db.execute(delete(Application))
        print("Deleted all applications.")
        
        # 5. Delete Campaign Media
        db.execute(delete(CampaignMedia))
        print("Deleted all campaign media.")
        
        # 6. Delete Campaigns
        db.execute(delete(Campaign))
        print("Deleted all campaigns.")
        
        # 7. Delete Influencer Profiles
        db.execute(delete(InfluencerProfile))
        print("Deleted all influencer profiles.")
        
        # 8. Delete non-admin Users
        from sqlalchemy import text
        db.execute(text("DELETE FROM users WHERE role != 'admin'"))
        print("Deleted all dummy influencers (non-admin users).")
        
        db.commit()
        print("Successfully reset all campaign-related test data.")
    except Exception as e:
        db.rollback()
        print(f"Error resetting data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_campaigns()
