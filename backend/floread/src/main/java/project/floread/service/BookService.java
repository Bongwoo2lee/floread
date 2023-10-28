package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Book;
import project.floread.model.BookEmotion;
import project.floread.model.User;
import project.floread.repository.BookEmotionRepository;
import project.floread.repository.BookRepository;
import project.floread.repository.UserRepository;

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookEmotionRepository bookEmotionRepository;

    //책 DB에서 삭제
    @Transactional
    public String  delete(String originName, String userId) {
        User user = userRepository.findByUserId(userId);
        Book book = bookRepository.findByOriginName(originName);
        try {
            List<BookEmotion> bookEmotion = bookEmotionRepository.findByBookEmotion(book);
            bookEmotionRepository.deleteByBook(book);
        } catch (Exception e) {

        }
        String url = book.getUrl();
        bookRepository.delete(book);
        File file = new File(url);
        if (file.exists()) {
            if (file.delete()) {
                return "파일 삭제 성공: " + file.getName();
            } else {
                return "파일 삭제 실패: " + file.getName();
            }
        } else {
            return "파일이 존재하지 않음: " + file.getName();
        }
    }

    //책 DB에 저장  
    @Transactional
    public Long join(Book book, String genre, String userId) {
        User user = userRepository.findByUserId(userId);
        book.setUser(user);
        book.setGenre(genre);
        System.out.println("book = " + book.toString());
        validateDuplicateBook(book, user);
        bookRepository.save(book);

        return book.getId();
    }

    @Transactional
    public Long joinEmotion(BookEmotion bookEmotion) {
        bookEmotionRepository.save(bookEmotion);
        return bookEmotion.getId();
    }

    @Transactional
    public List<String> findEmotions(Book book) {
        return bookEmotionRepository.findByEmotion(book);
    }

    //존재하는 책인지 확인하는 함수
    private void validateDuplicateBook(Book book, User user) {
        List<Book> findBooks = bookRepository.findByFileName(book.getFileName());
        if(!findBooks.isEmpty()) {
            for (Book findBook : findBooks) {
                if (Objects.equals(findBook.getUser().getId(), user.getId())) {
                    throw new IllegalStateException("이미 존재하는 책입니다.");
                }
            }
        }
    }

    //사용자의 OAuth2의 ID를 입력으로 받으면 그 사용자가 업로드한 책들의 경로를 출력
    @Transactional
    public void insertImageUrl(String image, Long id) {
        System.out.println("id = " + id);
        Optional<Book> getBook = bookRepository.findById(id);
        if (getBook.isPresent()) {
            Book book = getBook.get();
            book.setImage(image);
            System.out.println("book.getImage() = " + book.getImage());
            Book book1 = bookRepository.save(book);
            System.out.println("book1 = " + book1.getImage());
        } else {
            System.out.println("값이 없음");
        }
    }

    public List<Book> findBooks(String userId) {
        List<Book> books = bookRepository.findByBook(userId);
        for (Book book : books) {
            System.out.println(book.getFileName());
        }
        return books;
    }

    public Book findByOriginNameAndUser(String userId, String originName) {
        return bookRepository.findByOrOriginNameAndUser(userId, originName);
    }

    public Optional<Book> findBookById(Long bookId) {
        return bookRepository.findById(bookId);
    }

    public void update(String originName, String genre, String userId) {
        Book book = bookRepository.findByOrOriginNameAndUser(userId, originName);
        book.setGenre(genre);
    }

    public List<BookEmotion> findBookEmotion(Book book) {
        return bookEmotionRepository.findByBookEmotion(book);
    }
}
