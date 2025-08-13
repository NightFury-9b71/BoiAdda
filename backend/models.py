from typing import Optional, List
from enum import Enum
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from datetime import timedelta


# ===== ENUMS =====

class RoleType(str, Enum):
    ADMIN = "admin"
    USER = "user"

class BookStatus(str, Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

# ===== MODELS =====

class Role(SQLModel, table=True):
    __tablename__ = "role"
    id: Optional[int] = Field(default=None, primary_key=True)
    role_name: RoleType = Field(default=RoleType.USER)
    description: Optional[str] = None

    users: List["User"] = Relationship(back_populates="role")

class User(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    role_id: Optional[int] = Field(default=None, foreign_key="role.id")
    created_at: datetime = Field(default_factory=datetime.now)

    role: Optional[Role] = Relationship(back_populates="users")
    borrowed_books: List["BookCopy"] = Relationship(
        back_populates="current_holder", 
        sa_relationship_kwargs={"foreign_keys": "[BookCopy.current_holder_id]"}
    )
    donated_books: List["Book"] = Relationship(back_populates="donor")
    borrow_requests: List["BorrowTransaction"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"foreign_keys": "[BorrowTransaction.user_id]"}
    )
    donation_requests: List["DonationTransaction"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "[DonationTransaction.user_id]"}
    )

class Book(SQLModel, table=True):
    __tablename__ = "book"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    author: str
    isbn: str
    description: Optional[str] = None
    category: str
    cover_img: Optional[str] = None
    donor_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    donor: Optional[User] = Relationship(back_populates="donated_books")
    copies: List["BookCopy"] = Relationship(back_populates="book")
    donation_requests: List["DonationTransaction"] = Relationship(back_populates="book")

class BookCopy(SQLModel, table=True):
    __tablename__ = "book_copy"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    current_holder_id: Optional[int] = Field(default=None, foreign_key="user.id")
    status: BookStatus = Field(default=BookStatus.AVAILABLE)

    book: Optional[Book] = Relationship(back_populates="copies")
    current_holder: Optional[User] = Relationship(back_populates="borrowed_books")
    borrow_transactions: List["BorrowTransaction"] = Relationship(back_populates="book_copy")

class BorrowTransaction(SQLModel, table=True):
    __tablename__ = "borrow_transaction"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_copy_id: int = Field(foreign_key="book_copy.id")
    user_id: int = Field(foreign_key="user.id")
    admin_id: Optional[int] = Field(default=None, foreign_key="user.id")
    due_date: datetime = Field(default_factory=lambda: datetime.now() + timedelta(days=14))
    return_date: Optional[datetime] = None
    admin_comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)

    user: Optional[User] = Relationship(
        back_populates="borrow_requests", 
        sa_relationship_kwargs={"foreign_keys": "[BorrowTransaction.user_id]"}
    )
    admin: Optional[User] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[BorrowTransaction.admin_id]"}
    )
    book_copy: Optional[BookCopy] = Relationship(back_populates="borrow_transactions")

class DonationTransaction(SQLModel, table=True):
    __tablename__ = "donation_transaction"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    user_id: int = Field(foreign_key="user.id")
    admin_id: Optional[int] = Field(default=None, foreign_key="user.id")
    admin_comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)

    user: Optional[User] = Relationship(
        back_populates="donation_requests", 
        sa_relationship_kwargs={"foreign_keys": "[DonationTransaction.user_id]"}
    )
    admin: Optional[User] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[DonationTransaction.admin_id]"}
    )
    book: Optional[Book] = Relationship(back_populates="donation_requests")