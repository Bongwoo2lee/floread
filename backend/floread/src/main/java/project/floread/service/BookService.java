package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Book;
import project.floread.model.User;
import project.floread.repository.BookRepository;
import project.floread.repository.UserRepository;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long join(Book book, String userId) {
        User user = userRepository.findByUserId(userId);
        book.setUser(user);
        validateDuplicateBook(book);
        bookRepository.save(book);
        return book.getId();
    }

    private void validateDuplicateBook(Book book) {
        List<Book> findBooks = bookRepository.findByName(book.getFileName());
        if(!findBooks.isEmpty()) {
            throw new IllegalStateException("이미 존재하는 책입니다.");
        }
    }

    public List<String> findUrl(String userId) {
        List<String> urls = bookRepository.findByUrl(userId);
        return urls;
    }
}
