package project.floread.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;

import javax.persistence.EntityManager;
import java.io.File;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

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
}
