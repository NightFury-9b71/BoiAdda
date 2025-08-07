from models import User, Book, BookCopy, BookStatus

# ---- USERS ----

sample_users = [
    # Admins
    User(
        name="আদিয়াত হোসেন (অ্যাডমিন)",
        email="adiyat_admin@example.com",
        phone="01711110001",
        password="adminpass1",          # Never use plain passwords in prod!
        role_id=1
    ),
    # Moderators
    User(
        name="সাবিনা ইয়াসমিন (মডারেটর)",
        email="sabina_mod@example.com",
        phone="01733330003",
        password="modpass1",
        role_id=2
    ),
    # Regular Users
    User(
        name="রহিম উদ্দিন",
        email="rahim@example.com",
        phone="01722220002",
        password="userpass1",
        role_id=3
    ),
    User(
        name="তানভীর আহমেদ",
        email="tanvir@example.com",
        phone="01744440004",
        password="userpass2",
        role_id=3
    ),
    User(
        name="মাহিরা ইসলাম",
        email="mahera@example.com",
        phone="01755550005",
        password="userpass3",
        role_id=3
    ),
    User(
        name="রুশদী হাসান",
        email="rushdi@example.com",
        phone="01766660006",
        password="userpass4",
        role_id=3
    ),
    User(
        name="লতিফা নাসরিন",
        email="latifa@example.com",
        phone="01777770007",
        password="userpass5",
        role_id=3
    ),
]

# ---- BOOKS ----

sample_books = [
    Book(
        title="আজব দুনিয়া",
        author="মুহম্মদ জাফর ইকবাল",
        isbn="9789848000001",
        cover_img="book1.png",
        description="বিজ্ঞান ও কল্পনার এক অসাধারণ মিশেল।",
        category="বিজ্ঞান কল্পকাহিনি",
        donor_id=1  # Admin donated
    ),
    Book(
        title="হিমু",
        author="হুমায়ূন আহমেদ",
        isbn="9789848000002",
        cover_img="book2.png",
        description="হিমু চরিত্রের কল্পনাজাত মজার কাহিনী।",
        category="উপন্যাস",
        donor_id=3  # User donated
    ),
    Book(
        title="পাখি ও মানুষ",
        author="সেলিনা হোসেন",
        isbn="9789848000003",
        cover_img="book3.png",
        description="পাখি আর মানুষের সম্পর্ক নিয়ে সাহিত্য।",
        category="সাহিত্য",
        donor_id=3
    ),
    Book(
        title="চাঁদের আলো",
        author="আনিসুজ্জামান",
        isbn="9789848000004",
        cover_img="book4.png",
        description="রোমান্টিক ও রহস্যময় এক উপন্যাস।",
        category="উপন্যাস",
        donor_id=3
    ),
    Book(
        title="বাংলার ইতিহাস",
        author="ইমদাদুল হক মিলন",
        isbn="9789848000005",
        cover_img="book5.png",
        description="বাংলাদেশের ঐতিহাসিক তথ্যাবলী।",
        category="ইতিহাস",
        donor_id=3
    ),
    Book(
        title="কবিতা সংগ্রহ",
        author="জাহিদা হোসেন",
        isbn="9789848000006",
        cover_img="book6.png",
        description="নান্দনিক কাব্য রচনা।",
        category="কাব্য",
        donor_id=7
    ),
]

# ---- BOOK COPIES ----

sample_copies = [
    # Book 1 (ID 1): 2 available, 1 borrowed
    BookCopy(book_id=1, status=BookStatus.AVAILABLE),
    BookCopy(book_id=1, status=BookStatus.AVAILABLE),
    BookCopy(book_id=1, status=BookStatus.BORROWED, current_holder_id=3),  # borrowed by user_id 3

    # Book 2 (ID 2): 1 available, 1 borrowed, 1 lost
    BookCopy(book_id=2, status=BookStatus.AVAILABLE),
    BookCopy(book_id=2, status=BookStatus.BORROWED, current_holder_id=4),
    BookCopy(book_id=2, status=BookStatus.LOST),

    # Book 3 (ID 3): 1 available
    BookCopy(book_id=3, status=BookStatus.AVAILABLE),

    # Book 4 (ID 4): 2 available
    BookCopy(book_id=4, status=BookStatus.AVAILABLE),
    BookCopy(book_id=4, status=BookStatus.AVAILABLE),

    # Book 5 (ID 5): 1 borrowed, 1 available, 1 lost
    BookCopy(book_id=5, status=BookStatus.BORROWED, current_holder_id=5),
    BookCopy(book_id=5, status=BookStatus.AVAILABLE),
    BookCopy(book_id=5, status=BookStatus.LOST),

    # Book 6 (ID 6): 1 available
    BookCopy(book_id=6, status=BookStatus.AVAILABLE)
]
