package project.floread.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.floread.model.BookEntity;
import project.floread.repository.BookRepository;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<BookEntity> create(final BookEntity bookEntity) {
        //검증 부분
        validate(bookEntity);

        bookRepository.save(bookEntity);

        log.info("Entity id : {} is saved", bookEntity.getId());

        return bookRepository.findByUserId(bookEntity.getUserId());
    }

    public List<BookEntity> retrieve(final String userId) {
        return bookRepository.findByUserId(userId);
    }

    public List<BookEntity> update(final BookEntity bookEntity) {
        validate(bookEntity);

        //optional은 값이 없어도 ㄱㅊ
        final Optional<BookEntity> original = bookRepository.findById(bookEntity.getId());

        original.ifPresent(book -> {
            book.setTitle(bookEntity.getTitle());
            book.setUrl(bookEntity.getUrl());

            bookRepository.save(book);
        });

        //유저의 모든 book리스트 리턴
        return retrieve(bookEntity.getUserId());
    }

    public List<BookEntity> delete(final BookEntity bookEntity) {
        validate(bookEntity);

        try {
            bookRepository.delete(bookEntity);
        } catch (Exception e) {
            log.error("error deleting entity", bookEntity.getId(), e);

            throw new RuntimeException("error deleting entity"+bookEntity.getId());
        }

        return retrieve(bookEntity.getUserId());
    }

    private void validate(final BookEntity entity) {
        if(entity == null) {
            log.warn("Entity cannot be null");
            throw new RuntimeException("Entity cannot be null");
        }

        if(entity.getUserId() == null) {
            log.warn("Unknown user.");
            throw new RuntimeException("Unknown user.");
        }
    }
}
