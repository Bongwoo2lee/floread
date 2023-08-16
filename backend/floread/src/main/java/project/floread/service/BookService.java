package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Book;
import project.floread.model.BookEmotion;
import project.floread.model.User;
import project.floread.repository.BookEmotionRepository;
import project.floread.repository.BookRepository;
import project.floread.repository.UserRepository;

import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookEmotionRepository bookEmotionRepository;

    //책 DB에서 삭제
    @Transactional
    public void delete(String originName, String userId) {
        User user = userRepository.findByUserId(userId);
        Book book = bookRepository.findByOriginName(originName);
        BookEmotion bookEmotion = bookEmotionRepository.findByBookEmotion(book.getId());
        if (Objects.equals(book.getUser().getId(), user.getId())) {
            bookEmotionRepository.delete(bookEmotion);
            bookRepository.delete(book);
        }
    }

    //책 DB에 저장  
    @Transactional
    public Long join(Book book, String userId) {
        User user = userRepository.findByUserId(userId);
        book.setUser(user);
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
    public List<String> findUrl(String userId) {
        List<String> urls = bookRepository.findByUrl(userId);
        return urls;
    }

    public List<Book> findBooks(String userId) {
        List<Book> books = bookRepository.findByBook(userId);
        for (Book book : books) {
            System.out.println(book.getFileName());
        }
        return books;
    }

    public Book findByOriginName(String originName) {
        return bookRepository.findByOriginName(originName);
    }
}
