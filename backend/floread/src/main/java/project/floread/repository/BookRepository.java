package project.floread.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor

public class BookRepository {

    private final EntityManager em;

    public void save(Book book) {
        em.persist(book);
    }

    public List<Book> findById(long id) {
        return em.createQuery("select b from Book b", Book.class)
                .getResultList();
    }

    public List<Book> findByName(String fileName) {
        return em.createQuery("select b from Book b where b.fileName = :fileName", Book.class)
                .setParameter("fileName", fileName)
                .getResultList();
    }

    public List<String> findByUrl(String userId) {
        return em.createQuery("select b.url from Book b join b.user u  where u.userId = :userId", String.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public List<Book> findByBook(String userId) {
        return em.createQuery("select b from Book b join b.user u  where u.userId = :userId", Book.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}
