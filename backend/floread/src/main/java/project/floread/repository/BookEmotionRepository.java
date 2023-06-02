package project.floread.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;
import project.floread.model.BookEmotion;
import project.floread.model.Emotion;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookEmotionRepository {

    private final EntityManager em;

    public void save(BookEmotion bookEmotion) {
        em.persist(bookEmotion);
    }

    public List<Emotion> findByEmotion(Book book) {
        return em.createQuery("select be.emotion from BookEmotion be where be.book = :book", Emotion.class)
                .setParameter("book", book)
                .getResultList();
    }

}
