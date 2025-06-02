#!/usr/bin/env python
"""
Test database connection
"""
import os
import sys
import psycopg2
from sqlalchemy import create_engine, text

def test_psycopg2_connection():
    """Test direct psycopg2 connection"""
    try:
        print("Testing direct psycopg2 connection...")
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            database="tugasku_db",
            user="postgres",
            password="1812nasya",
            client_encoding="utf8"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Direct connection successful: {version[0]}")
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Direct connection failed: {e}")
        return False

def test_sqlalchemy_connection():
    """Test SQLAlchemy connection"""
    try:
        print("Testing SQLAlchemy connection...")
        database_url = "postgresql+psycopg2://postgres:1812nasya@localhost:5432/tugasku_db?client_encoding=utf8"
        
        engine = create_engine(
            database_url,
            echo=True,
            pool_pre_ping=True,
            connect_args={
                'client_encoding': 'utf8',
                'connect_timeout': 10
            }
        )
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            print(f"✅ SQLAlchemy connection successful: {row}")
        
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy connection failed: {e}")
        return False

def main():
    """Run connection tests"""
    print("🔍 Testing database connections...\n")
    
    # Test direct connection
    direct_success = test_psycopg2_connection()
    print()
    
    # Test SQLAlchemy connection
    sqlalchemy_success = test_sqlalchemy_connection()
    print()
    
    if direct_success and sqlalchemy_success:
        print("🎉 All connection tests passed!")
        return True
    else:
        print("❌ Some connection tests failed!")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
