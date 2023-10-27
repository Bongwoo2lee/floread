package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;
import project.floread.model.BookEmotion;

import java.util.List;

@Repository
public interface BookEmotionRepository extends JpaRepository<BookEmotion, Long> {

    @Query(value = "select be from BookEmotion be where be.book = :bookId")
    BookEmotion findByBookEmotion(@Param("bookId") Long bookId);

    @Query(value = "select be.emotion.emotion from BookEmotion be where be.book = :book")
    List<String> findByEmotion(@Param("book") Book book);
}
