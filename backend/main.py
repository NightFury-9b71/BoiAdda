from typing import Optional, List
from datetime import datetime, timedelta
import logging
import time

from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, Session, create_engine, select
from pydantic import BaseModel

from models import *
from config import settings
from security import get_password_hash, verify_password, create_access_token, get_current_user_id
from logging_config import setup_logging

# ===== LOGGING SETUP =====
logger = setup_logging()

# ===== DB SETUP =====

# Use environment-based database URL
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

def create_tables():
    # Safe table creation - only create if doesn't exist
    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session:
        yield session

# ===== SAMPLE DATA =====

def populate_sample_data():
    with Session(engine) as session:
        # Create roles first
        roles = [
            Role(id=1, role_name=RoleType.ADMIN, description="Administrator"),
            Role(id=2, role_name=RoleType.USER, description="Moderator"),
            Role(id=3, role_name=RoleType.USER, description="Regular User"),
        ]
        
        for role in roles:
            session.add(role)
        session.commit()
        
        # Create sample users with hashed passwords
        sample_users = [
            User(name="আদিয়াত হোসেন (অ্যাডমিন)", email="adiyat_admin@example.com", phone="01711110001", password=get_password_hash("adminpass1"), role_id=1),
            User(name="সাবিনা ইয়াসমিন (মডারেটর)", email="sabina_mod@example.com", phone="01733330003", password=get_password_hash("modpass1"), role_id=2),
            User(name="রহিম উদ্দিন", email="rahim@example.com", phone="01722220002", password=get_password_hash("userpass1"), role_id=3),
            User(name="তানভীর আহমেদ", email="tanvir@example.com", phone="01744440004", password=get_password_hash("userpass2"), role_id=3),
            User(name="মাহিরা ইসলাম", email="mahera@example.com", phone="01755550005", password=get_password_hash("userpass3"), role_id=3),
            User(name="রুশদী হাসান", email="rushdi@example.com", phone="01766660006", password=get_password_hash("userpass4"), role_id=3),
            User(name="লতিফা নাসরিন", email="latifa@example.com", phone="01777770007", password=get_password_hash("userpass5"), role_id=3),
            User(name="Demo User", email="demo@boiadda.com", phone="01700000000", password=get_password_hash("Demo123456"), role_id=3),
        ]
        
        for user in sample_users:
            session.add(user)
        session.commit()
        
        # Create sample books
        sample_books = [
            Book(title="আজব দুনিয়া", author="মুহম্মদ জাফর ইকবাল", isbn="9789848000001", cover_img="book1.png", description="বিজ্ঞান ও কল্পনার এক অসাধারণ মিশেল।", category="বিজ্ঞান কল্পকাহিনি", donor_id=1),
            Book(title="হিমু", author="হুমায়ূন আহমেদ", isbn="9789848000002", cover_img="book2.png", description="হিমু চরিত্রের কল্পনাজাত মজার কাহিনী।", category="উপন্যাস", donor_id=3),
            Book(title="পাখি ও মানুষ", author="সেলিনা হোসেন", isbn="9789848000003", cover_img="book3.png", description="পাখি আর মানুষের সম্পর্ক নিয়ে সাহিত্য।", category="সাহিত্য", donor_id=3),
            Book(title="চাঁদের আলো", author="আনিসুজ্জামান", isbn="9789848000004", cover_img="book4.png", description="রোমান্টিক ও রহস্যময় এক উপন্যাস।", category="উপন্যাস", donor_id=3),
            Book(title="বাংলার ইতিহাস", author="ইমদাদুল হক মিলন", isbn="9789848000005", cover_img="book5.png", description="বাংলাদেশের ঐতিহাসিক তথ্যাবলী।", category="ইতিহাস", donor_id=3),
            Book(title="কবিতা সংগ্রহ", author="জাহিদা হোসেন", isbn="9789848000006", cover_img="book6.png", description="নান্দনিক কাব্য রচনা।", category="কাব্য", donor_id=7),
        ]
        
        for book in sample_books:
            session.add(book)
        session.commit()
        
        # Create sample book copies
        sample_copies = [
            BookCopy(book_id=1, status=BookStatus.AVAILABLE),
            BookCopy(book_id=1, status=BookStatus.AVAILABLE),
            BookCopy(book_id=1, status=BookStatus.BORROWED, current_holder_id=3),
            BookCopy(book_id=2, status=BookStatus.AVAILABLE),
            BookCopy(book_id=2, status=BookStatus.BORROWED, current_holder_id=4),
            BookCopy(book_id=2, status=BookStatus.LOST),
            BookCopy(book_id=3, status=BookStatus.AVAILABLE),
            BookCopy(book_id=4, status=BookStatus.AVAILABLE),
            BookCopy(book_id=4, status=BookStatus.AVAILABLE),
            BookCopy(book_id=5, status=BookStatus.BORROWED, current_holder_id=5),
            BookCopy(book_id=5, status=BookStatus.AVAILABLE),
            BookCopy(book_id=5, status=BookStatus.LOST),
            BookCopy(book_id=6, status=BookStatus.AVAILABLE),
        ]
        
        for copy in sample_copies:
            session.add(copy)
        session.commit()
        
        logger.info("✅ Sample data populated successfully!")

# Initialize database and populate sample data (only if enabled in settings)
def initialize_database():
    create_tables()
    # Only seed demo data if enabled in settings
    if settings.SEED_DEMO_DATA:
        with Session(engine) as session:
            existing_roles = session.exec(select(Role)).first()
            if not existing_roles:
                populate_sample_data()
            else:
                logger.info("✅ Database already contains data. Skipping sample data population.")

initialize_database()

# ===== FASTAPI APP =====

app = FastAPI(
    title="BoiAdda Library API",
    description="A modern library management system",
    version="1.0.0",
    debug=settings.DEBUG
)

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# CORS middleware with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/healthz", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/readyz", tags=["health"])
def readiness_check(db: Session = Depends(get_db)):
    """Readiness check endpoint"""
    try:
        # Test database connection
        db.exec(select(Role)).first()
        return {"status": "ready", "timestamp": datetime.utcnow()}
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        raise HTTPException(status_code=503, detail="Service not ready")

# ===== RESPONSE MODELS =====

from pydantic import BaseModel

class BookInfo(BaseModel):
    id: int
    title: str
    author: str
    category: str
    available_copies: int
    description: Optional[str] = None
    isbn: str
    cover_img: Optional[str] = None
    user_can_borrow: bool = True  # New field to indicate if user can borrow this book

class BorrowRequestInput(BaseModel):
    user_id: int

class DonationRequestInput(BaseModel):
    user_id: int

class BookDonationInput(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    cover_img: Optional[str] = None
    category: str = "সাধারণ"  # Default category

class AdminActionInput(BaseModel):
    admin_id: int
    comment: Optional[str] = None

class UserInfo(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role_name: str

class ReturnBookInput(BaseModel):
    book_copy_id: int  # New field to specify which copy to return

# ===== AUTHENTICATION MODELS =====

class UserRegistration(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo
    expires_in: int

class AuthUser(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role_name: str
    created_at: datetime

# ===== AUTHENTICATION ROUTES =====

@app.post("/auth/register", response_model=AuthResponse, tags=["auth"])
def register_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email already exists
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(400, detail="Email already registered")

    # Check if phone already exists
    if user_data.phone:
        existing_phone = db.exec(select(User).where(User.phone == user_data.phone)).first()
        if existing_phone:
            raise HTTPException(400, detail="Phone number already registered")

    # Get the USER role
    user_role = db.exec(select(Role).where(Role.id == 3)).first()  # Regular user role
    if not user_role:
        raise HTTPException(500, detail="User role not found")

    # Create new user with hashed password
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=get_password_hash(user_data.password),
        role_id=user_role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email, "role": user_role.role_name.value}
    )

    # Get role for response
    role = db.get(Role, new_user.role_id)
    user_info = UserInfo(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        phone=new_user.phone,
        role_name=role.role_name.value
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_info,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/auth/login", response_model=AuthResponse, tags=["auth"])
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user with email and password"""
    # Find user by email
    user_with_role = db.exec(
        select(User, Role).join(Role, User.role_id == Role.id).where(User.email == login_data.email)
    ).first()
    
    if not user_with_role:
        raise HTTPException(401, detail="Invalid email or password")
    
    user_obj, role_obj = user_with_role
    
    # Verify password
    if not verify_password(login_data.password, user_obj.password):
        raise HTTPException(401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user_obj.id), "email": user_obj.email, "role": role_obj.role_name.value}
    )
    
    user_info = UserInfo(
        id=user_obj.id,
        name=user_obj.name,
        email=user_obj.email,
        phone=user_obj.phone,
        role_name=role_obj.role_name.value
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_info,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/auth/logout", tags=["auth"])
def logout_user():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

@app.get("/auth/me", response_model=AuthUser, tags=["auth"])
def get_current_user(
    user_id: Optional[int] = Query(None),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    # Use the authenticated user's ID or the provided user_id for backwards compatibility
    target_user_id = current_user_id if current_user_id else user_id
    
    if not target_user_id:
        raise HTTPException(400, detail="User ID required")
    
    user_with_role = db.exec(
        select(User, Role).join(Role, User.role_id == Role.id).where(User.id == target_user_id)
    ).first()
    
    if not user_with_role:
        raise HTTPException(404, detail="User not found")
    
    user_obj, role_obj = user_with_role
    
    return AuthUser(
        id=user_obj.id,
        name=user_obj.name,
        email=user_obj.email,
        phone=user_obj.phone,
        role_name=role_obj.role_name.value,
        created_at=user_obj.created_at
    )

# ===== ROUTES =====

@app.get("/", tags=["public"])
def root():
    return {"msg": "Welcome to the Library API."}

@app.get("/users/", response_model=List[UserInfo], tags=["public"])
def get_users(db: Session = Depends(get_db)):
    """Get all users with their role information"""
    users = db.exec(
        select(User, Role).join(Role, User.role_id == Role.id)
    ).all()
    
    result = []
    for user, role in users:
        result.append(UserInfo(
            id=user.id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            role_name=role.role_name.value
        ))
    return result

@app.get("/books/", response_model=List[BookInfo], tags=["public"])
def get_books(user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """Get all books with availability info for a specific user"""
    books = db.exec(select(Book)).all()
    data = []
    for book in books:
        available_copies = db.exec(
            select(BookCopy).where((BookCopy.book_id == book.id) & (BookCopy.status == BookStatus.AVAILABLE))
        ).all()
        
        # Check if user can borrow this book (doesn't already have a copy or pending request)
        user_can_borrow = True
        if user_id:
            # Check if user currently has this book borrowed
            current_borrow = db.exec(
                select(BorrowTransaction).join(BookCopy).where(
                    (BorrowTransaction.user_id == user_id) &
                    (BookCopy.book_id == book.id) &
                    (BorrowTransaction.status == TransactionStatus.SUCCESS) &
                    (BorrowTransaction.return_date == None)
                )
            ).first()
            
            # Check if user has pending request for this book
            pending_request = db.exec(
                select(BorrowTransaction).join(BookCopy).where(
                    (BorrowTransaction.user_id == user_id) &
                    (BookCopy.book_id == book.id) &
                    (BorrowTransaction.status == TransactionStatus.PENDING)
                )
            ).first()
            
            if current_borrow or pending_request:
                user_can_borrow = False
        
        data.append(BookInfo(
            id=book.id, 
            title=book.title, 
            author=book.author,
            category=book.category, 
            available_copies=len(available_copies),
            description=book.description,
            isbn=book.isbn,
            cover_img=book.cover_img,
            user_can_borrow=user_can_borrow
        ))
    return data

@app.post("/borrow/{book_id}", tags=["public"])
def request_borrow(book_id: int, req: BorrowRequestInput, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.get(User, req.user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    # Check if book exists
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(404, detail="Book not found.")
    
    # Check if user already has this book borrowed
    existing_borrow = db.exec(
        select(BorrowTransaction).join(BookCopy).where(
            (BorrowTransaction.user_id == req.user_id) &
            (BookCopy.book_id == book_id) &
            (BorrowTransaction.status == TransactionStatus.SUCCESS) &
            (BorrowTransaction.return_date == None)
        )
    ).first()
    if existing_borrow:
        raise HTTPException(400, detail="You already have a copy of this book borrowed.")
    
    # Check if user has pending request for this book
    pending_request = db.exec(
        select(BorrowTransaction).join(BookCopy).where(
            (BorrowTransaction.user_id == req.user_id) &
            (BookCopy.book_id == book_id) &
            (BorrowTransaction.status == TransactionStatus.PENDING)
        )
    ).first()
    if pending_request:
        raise HTTPException(400, detail="You already have a pending borrow request for this book.")
    
    # Find available copy
    copy = db.exec(
        select(BookCopy).where(
            BookCopy.book_id == book_id,
            BookCopy.status == BookStatus.AVAILABLE
        )
    ).first()
    if not copy:
        raise HTTPException(404, detail="No available copy found.")
    
    txn = BorrowTransaction(
        book_copy_id=copy.id,
        user_id=req.user_id,
        due_date=datetime.utcnow() + timedelta(days=14),
        status=TransactionStatus.PENDING
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {"message": "Borrow request submitted", "borrow_txn_id": txn.id, "copy_id": copy.id}

@app.post("/donate", tags=["public"])
def create_book_donation(book_data: BookDonationInput, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Create a new book and submit it for donation"""
    # Check if user exists
    user = db.get(User, current_user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    # Generate a simple ISBN for donated books
    import uuid
    simple_isbn = f"DONATED-{str(uuid.uuid4())[:8].upper()}"
    
    # Create new book
    new_book = Book(
        title=book_data.title,
        author=book_data.author,
        isbn=simple_isbn,
        description=book_data.description,
        category=book_data.category,
        cover_img=book_data.cover_img,
        donor_id=current_user_id
    )
    db.add(new_book)
    db.flush()  # Flush to get the book ID
    
    # Create donation transaction
    txn = DonationTransaction(
        user_id=current_user_id,
        book_id=new_book.id,
        status=TransactionStatus.PENDING
    )
    db.add(txn)
    db.commit()
    db.refresh(new_book)
    db.refresh(txn)
    
    return {
        "message": "Book donation submitted successfully", 
        "book_id": new_book.id,
        "donation_txn_id": txn.id
    }

@app.post("/donate/{book_id}", tags=["public"])
def request_donation(book_id: int, req: DonationRequestInput, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.get(User, req.user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    # Check if book exists
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(404, detail="Book not found.")
    
    txn = DonationTransaction(
        user_id=req.user_id, book_id=book_id, status=TransactionStatus.PENDING
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {"message": "Donation request submitted", "donation_txn_id": txn.id}

@app.post("/return/", tags=["public"])
def return_book(*, user_id: int = Query(...), book_copy_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """Return a specific book copy. If book_copy_id is not provided, returns the first borrowed book."""
    # Check if user exists
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    # Build query for active borrowed transactions
    query = select(BorrowTransaction).where(
        BorrowTransaction.user_id == user_id,
        BorrowTransaction.status == TransactionStatus.SUCCESS,
        BorrowTransaction.return_date == None
    )
    
    # If specific copy is requested, filter by it
    if book_copy_id:
        query = query.where(BorrowTransaction.book_copy_id == book_copy_id)
        txn = db.exec(query).first()
        if not txn:
            raise HTTPException(404, "No active borrowed transaction found for the specified book copy.")
    else:
        # Return the first borrowed book if no specific copy is mentioned
        txn = db.exec(query).first()
        if not txn:
            raise HTTPException(404, "No active borrowed book transaction found.")
    
    book_copy: BookCopy = db.get(BookCopy, txn.book_copy_id)
    txn.return_date = datetime.utcnow()
    book_copy.status = BookStatus.AVAILABLE
    book_copy.current_holder_id = None
    db.add(txn)
    db.add(book_copy)
    db.commit()
    return {"message": f"Book copy {book_copy.id} returned.", "book_copy_id": book_copy.id}

# NEW ROUTE: Get user's borrowed books for easy return
@app.get("/users/{user_id}/borrowed-books", tags=["public"])
def get_user_borrowed_books(user_id: int, db: Session = Depends(get_db)):
    """Get all books currently borrowed by a user"""
    # Check if user exists
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    borrowed_books = db.exec(
        select(BorrowTransaction, BookCopy, Book).join(
            BookCopy, BorrowTransaction.book_copy_id == BookCopy.id
        ).join(
            Book, BookCopy.book_id == Book.id
        ).where(
            (BorrowTransaction.user_id == user_id) &
            (BorrowTransaction.status == TransactionStatus.SUCCESS) &
            (BorrowTransaction.return_date == None)
        )
    ).all()
    
    result = []
    for txn, copy, book in borrowed_books:
        result.append({
            "book_copy_id": copy.id,
            "book_id": book.id,
            "title": book.title,
            "author": book.author,
            "category": book.category,
            "borrowed_date": txn.created_at,
            "due_date": txn.due_date,
            "is_overdue": datetime.utcnow() > txn.due_date
        })
    
    return result

# ========== ADMIN ROUTES ==========

# Response models for admin endpoints
class AdminBorrowRequest(BaseModel):
    id: int
    user_id: int
    book_copy_id: int
    due_date: Optional[datetime]
    status: TransactionStatus
    created_at: datetime
    updated_at: Optional[datetime]
    admin_id: Optional[int]
    admin_comment: Optional[str]
    user: UserInfo
    book: BookInfo

class AdminDonationRequest(BaseModel):
    id: int
    user_id: int
    book_id: int
    status: TransactionStatus
    created_at: datetime
    updated_at: Optional[datetime]
    admin_id: Optional[int]
    admin_comment: Optional[str]
    user: UserInfo
    book: BookInfo

@app.get("/admin/borrow-requests/", response_model=List[AdminBorrowRequest], tags=["admin"])
def list_pending_borrow(db: Session = Depends(get_db)):
    txs = db.exec(
        select(BorrowTransaction, BookCopy, Book, User, Role).join(
            BookCopy, BorrowTransaction.book_copy_id == BookCopy.id
        ).join(
            Book, BookCopy.book_id == Book.id
        ).join(
            User, BorrowTransaction.user_id == User.id
        ).join(
            Role, User.role_id == Role.id
        ).where(BorrowTransaction.status == TransactionStatus.PENDING)
    ).all()
    
    result = []
    for txn, copy, book, user, role in txs:
        # Count available copies for the book
        available_copies = db.exec(
            select(BookCopy).where(
                (BookCopy.book_id == book.id) & 
                (BookCopy.status == BookStatus.AVAILABLE)
            )
        ).all()
        
        result.append(AdminBorrowRequest(
            id=txn.id,
            user_id=txn.user_id,
            book_copy_id=txn.book_copy_id,
            due_date=txn.due_date,
            status=txn.status,
            created_at=txn.created_at,
            updated_at=txn.updated_at,
            admin_id=txn.admin_id,
            admin_comment=txn.admin_comment,
            user=UserInfo(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                role_name=role.role_name.value
            ),
            book=BookInfo(
                id=book.id,
                title=book.title,
                author=book.author,
                category=book.category,
                available_copies=len(available_copies),
                description=book.description,
                isbn=book.isbn,
                cover_img=book.cover_img,
                user_can_borrow=True
            )
        ))
    return result

@app.get("/admin/donation-requests/", response_model=List[AdminDonationRequest], tags=["admin"])
def list_pending_donations(db: Session = Depends(get_db)):
    txs = db.exec(
        select(DonationTransaction, Book, User, Role).join(
            Book, DonationTransaction.book_id == Book.id
        ).join(
            User, DonationTransaction.user_id == User.id
        ).join(
            Role, User.role_id == Role.id
        ).where(DonationTransaction.status == TransactionStatus.PENDING)
    ).all()
    
    result = []
    for txn, book, user, role in txs:
        # Count available copies for the book
        available_copies = db.exec(
            select(BookCopy).where(
                (BookCopy.book_id == book.id) & 
                (BookCopy.status == BookStatus.AVAILABLE)
            )
        ).all()
        
        result.append(AdminDonationRequest(
            id=txn.id,
            user_id=txn.user_id,
            book_id=txn.book_id,
            status=txn.status,
            created_at=txn.created_at,
            updated_at=txn.updated_at,
            admin_id=txn.admin_id,
            admin_comment=txn.admin_comment,
            user=UserInfo(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                role_name=role.role_name.value
            ),
            book=BookInfo(
                id=book.id,
                title=book.title,
                author=book.author,
                category=book.category,
                available_copies=len(available_copies),
                description=book.description,
                isbn=book.isbn,
                cover_img=book.cover_img,
                user_can_borrow=True
            )
        ))
    return result

@app.post("/admin/borrow-requests/{tx_id}/approve", tags=["admin"])
def approve_borrow(tx_id: int, input: AdminActionInput, db: Session = Depends(get_db)):
    # Check if admin exists
    admin = db.get(User, input.admin_id)
    if not admin:
        raise HTTPException(404, detail="Admin not found.")
    
    tx = db.get(BorrowTransaction, tx_id)
    if not tx or tx.status != TransactionStatus.PENDING:
        raise HTTPException(404, "Transaction not found or already handled.")
    
    book_copy = db.get(BookCopy, tx.book_copy_id)
    if not book_copy or book_copy.status != BookStatus.AVAILABLE:
        raise HTTPException(400, "Book copy is not available any more.")
    
    tx.status = TransactionStatus.SUCCESS
    tx.admin_id = input.admin_id
    tx.admin_comment = input.comment
    tx.updated_at = datetime.utcnow()
    book_copy.status = BookStatus.BORROWED
    book_copy.current_holder_id = tx.user_id
    
    db.add(tx)
    db.add(book_copy)
    db.commit()
    return {"message": "Borrow request approved."}

@app.post("/admin/borrow-requests/{tx_id}/reject", tags=["admin"])
def reject_borrow(tx_id: int, input: AdminActionInput, db: Session = Depends(get_db)):
    # Check if admin exists
    admin = db.get(User, input.admin_id)
    if not admin:
        raise HTTPException(404, detail="Admin not found.")
    
    tx = db.get(BorrowTransaction, tx_id)
    if not tx or tx.status != TransactionStatus.PENDING:
        raise HTTPException(404, "Transaction not found or already handled.")
    
    tx.status = TransactionStatus.FAILED
    tx.admin_id = input.admin_id
    tx.admin_comment = input.comment
    tx.updated_at = datetime.utcnow()
    db.add(tx)
    db.commit()
    return {"message": "Borrow request rejected."}

@app.post("/admin/donation-requests/{tx_id}/approve", tags=["admin"])
def approve_donation(tx_id: int, input: AdminActionInput, db: Session = Depends(get_db)):
    # Check if admin exists
    admin = db.get(User, input.admin_id)
    if not admin:
        raise HTTPException(404, detail="Admin not found.")
    
    tx = db.get(DonationTransaction, tx_id)
    if not tx or tx.status != TransactionStatus.PENDING:
        raise HTTPException(404, "Donation request not found or already handled.")
    
    tx.status = TransactionStatus.SUCCESS
    tx.admin_id = input.admin_id
    tx.admin_comment = input.comment
    tx.updated_at = datetime.utcnow()
    
    # Add new physical copy to library
    new_copy = BookCopy(book_id=tx.book_id, status=BookStatus.AVAILABLE)
    db.add(tx)
    db.add(new_copy)
    db.commit()
    return {"message": "Donation approved and new copy added."}

@app.post("/admin/donation-requests/{tx_id}/reject", tags=["admin"])
def reject_donation(tx_id: int, input: AdminActionInput, db: Session = Depends(get_db)):
    # Check if admin exists
    admin = db.get(User, input.admin_id)
    if not admin:
        raise HTTPException(404, detail="Admin not found.")
    
    tx = db.get(DonationTransaction, tx_id)
    if not tx or tx.status != TransactionStatus.PENDING:
        raise HTTPException(404, "Donation request not found or already handled.")
    
    tx.status = TransactionStatus.FAILED
    tx.admin_id = input.admin_id
    tx.admin_comment = input.comment
    tx.updated_at = datetime.utcnow()
    db.add(tx)
    db.commit()
    return {"message": "Donation rejected."}

class RecentActivity(BaseModel):
    id: str
    type: str  # 'borrow', 'donation', 'return', 'member'
    description: str
    timestamp: datetime
    user_name: Optional[str] = None
    book_title: Optional[str] = None

@app.get("/recent-activities", response_model=List[RecentActivity], tags=["public"])
def get_recent_activities(limit: int = Query(10, le=50), db: Session = Depends(get_db)):
    """Get recent activities across the library"""
    activities = []
    
    # Get recent successful borrow transactions
    recent_borrows = db.exec(
        select(BorrowTransaction, User, BookCopy, Book).join(
            User, BorrowTransaction.user_id == User.id
        ).join(
            BookCopy, BorrowTransaction.book_copy_id == BookCopy.id
        ).join(
            Book, BookCopy.book_id == Book.id
        ).where(
            BorrowTransaction.status == TransactionStatus.SUCCESS
        ).order_by(BorrowTransaction.updated_at.desc()).limit(limit // 2)
    ).all()
    
    for txn, user, copy, book in recent_borrows:
        activities.append(RecentActivity(
            id=f"borrow_{txn.id}",
            type="borrow",
            description=f"{user.name} ধার নিয়েছেন \"{book.title}\"",
            timestamp=txn.updated_at or txn.created_at,
            user_name=user.name,
            book_title=book.title
        ))
    
    # Get recent successful donation transactions
    recent_donations = db.exec(
        select(DonationTransaction, User, Book).join(
            User, DonationTransaction.user_id == User.id
        ).join(
            Book, DonationTransaction.book_id == Book.id
        ).where(
            DonationTransaction.status == TransactionStatus.SUCCESS
        ).order_by(DonationTransaction.updated_at.desc()).limit(limit // 2)
    ).all()
    
    for txn, user, book in recent_donations:
        activities.append(RecentActivity(
            id=f"donation_{txn.id}",
            type="donation",
            description=f"{user.name} দান করেছেন \"{book.title}\"",
            timestamp=txn.updated_at or txn.created_at,
            user_name=user.name,
            book_title=book.title
        ))
    
    # Get recent returns (transactions with return_date)
    recent_returns = db.exec(
        select(BorrowTransaction, User, BookCopy, Book).join(
            User, BorrowTransaction.user_id == User.id
        ).join(
            BookCopy, BorrowTransaction.book_copy_id == BookCopy.id
        ).join(
            Book, BookCopy.book_id == Book.id
        ).where(
            BorrowTransaction.return_date.isnot(None)
        ).order_by(BorrowTransaction.return_date.desc()).limit(limit // 4)
    ).all()
    
    for txn, user, copy, book in recent_returns:
        activities.append(RecentActivity(
            id=f"return_{txn.id}",
            type="return", 
            description=f"{user.name} ফেরত দিয়েছেন \"{book.title}\"",
            timestamp=txn.return_date,
            user_name=user.name,
            book_title=book.title
        ))
    
    # Get recent new users
    recent_users = db.exec(
        select(User).order_by(User.created_at.desc()).limit(limit // 4)
    ).all()
    
    for user in recent_users:
        activities.append(RecentActivity(
            id=f"member_{user.id}",
            type="member",
            description=f"{user.name} নতুন সদস্য হিসেবে যোগ দিয়েছেন",
            timestamp=user.created_at,
            user_name=user.name
        ))
    
    # Sort all activities by timestamp and return limited results
    activities.sort(key=lambda x: x.timestamp, reverse=True)
    return activities[:limit]

class UserBorrowedBook(BaseModel):
    id: int
    book_title: str
    book_author: str
    book_category: str
    due_date: Optional[datetime] = None
    borrowed_date: datetime
    return_date: Optional[datetime] = None
    status: str  # "Current", "Returned", "Pending", "Rejected"
    is_overdue: bool
    admin_comment: Optional[str] = None
    book_copy_id: Optional[int] = None  # New field to identify specific copy

class UserDonatedBook(BaseModel):
    id: int
    book_title: str
    book_author: str
    book_category: str
    donation_date: datetime
    status: str  # "Approved", "Pending", "Rejected"
    copies_added: int
    admin_comment: Optional[str] = None

class UserStatistics(BaseModel):
    borrowed_books: List[UserBorrowedBook]
    donated_books: List[UserDonatedBook]
    total_borrowed: int
    total_donated: int
    current_borrowed: int
    overdue_books: int
    pending_borrow_requests: int
    pending_donation_requests: int
    rejected_borrow_requests: int
    rejected_donation_requests: int

@app.get("/users/{user_id}/statistics", response_model=UserStatistics, tags=["public"])
def get_user_statistics(user_id: int, db: Session = Depends(get_db)):
    """Get comprehensive statistics for a specific user"""
    # Check if user exists
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, detail="User not found.")
    
    # Get ALL borrow transactions (success, pending, failed)
    borrow_transactions = db.exec(
        select(BorrowTransaction, BookCopy, Book).join(
            BookCopy, BorrowTransaction.book_copy_id == BookCopy.id
        ).join(
            Book, BookCopy.book_id == Book.id
        ).where(
            BorrowTransaction.user_id == user_id
        ).order_by(BorrowTransaction.created_at.desc())
    ).all()
    
    borrowed_books = []
    current_borrowed = 0
    overdue_books = 0
    pending_borrow = 0
    rejected_borrow = 0
    successful_borrow = 0
    
    for txn, copy, book in borrow_transactions:
        status_map = {
            TransactionStatus.SUCCESS: "Approved" if txn.return_date is None else "Returned",
            TransactionStatus.PENDING: "Pending",
            TransactionStatus.FAILED: "Rejected"
        }
        
        status = status_map[txn.status]
        is_current = txn.status == TransactionStatus.SUCCESS and txn.return_date is None
        is_overdue = is_current and datetime.utcnow() > txn.due_date
        
        if txn.status == TransactionStatus.SUCCESS:
            successful_borrow += 1
            if is_current:
                current_borrowed += 1
                status = "Current"
        elif txn.status == TransactionStatus.PENDING:
            pending_borrow += 1
        elif txn.status == TransactionStatus.FAILED:
            rejected_borrow += 1
            
        if is_overdue:
            overdue_books += 1
            status = "Overdue"
            
        borrowed_books.append(UserBorrowedBook(
            id=txn.id,
            book_title=book.title,
            book_author=book.author,
            book_category=book.category,
            due_date=txn.due_date if txn.status == TransactionStatus.SUCCESS else None,
            borrowed_date=txn.created_at,
            return_date=txn.return_date,
            status=status,
            is_overdue=is_overdue,
            admin_comment=txn.admin_comment,
            book_copy_id=copy.id
        ))
    
    # Get ALL donation transactions (success, pending, failed)
    donation_transactions = db.exec(
        select(DonationTransaction, Book).join(
            Book, DonationTransaction.book_id == Book.id
        ).where(
            DonationTransaction.user_id == user_id
        ).order_by(DonationTransaction.created_at.desc())
    ).all()
    
    donated_books = []
    pending_donation = 0
    rejected_donation = 0
    successful_donation = 0
    
    for txn, book in donation_transactions:
        status_map = {
            TransactionStatus.SUCCESS: "Approved",
            TransactionStatus.PENDING: "Pending", 
            TransactionStatus.FAILED: "Rejected"
        }
        
        status = status_map[txn.status]
        copies_added = 1 if txn.status == TransactionStatus.SUCCESS else 0
        
        if txn.status == TransactionStatus.SUCCESS:
            successful_donation += 1
        elif txn.status == TransactionStatus.PENDING:
            pending_donation += 1
        elif txn.status == TransactionStatus.FAILED:
            rejected_donation += 1
        
        donated_books.append(UserDonatedBook(
            id=txn.id,
            book_title=book.title,
            book_author=book.author,
            book_category=book.category,
            donation_date=txn.created_at,
            status=status,
            copies_added=copies_added,
            admin_comment=txn.admin_comment
        ))
    
    return UserStatistics(
        borrowed_books=borrowed_books,
        donated_books=donated_books,
        total_borrowed=successful_borrow,
        total_donated=successful_donation,
        current_borrowed=current_borrowed,
        overdue_books=overdue_books,
        pending_borrow_requests=pending_borrow,
        pending_donation_requests=pending_donation,
        rejected_borrow_requests=rejected_borrow,
        rejected_donation_requests=rejected_donation
    )

# ===== UTILITY ROUTES =====

@app.get("/reset-db/", tags=["utility"])
def reset_database():
    """Reset and repopulate the database with sample data (DEV ONLY)"""
    if settings.ENVIRONMENT == "production":
        raise HTTPException(403, detail="Not allowed in production")
    
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    populate_sample_data()
    return {"message": "Database reset and populated with sample data"}

# ===== APPLICATION INFO =====

@app.get("/info", tags=["info"])
def app_info():
    """Get application information"""
    return {
        "name": "BoiAdda Library API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )