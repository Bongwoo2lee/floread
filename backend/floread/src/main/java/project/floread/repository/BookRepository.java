package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    //jpaRepository<T, id> t는 테이블에 매핑할 엔티티 클래스, id는 엔티티의 기본키 타입

    Book findByOriginName(String originName);

    List<Book> findByFileName(String fileName);


    @Query(value = "select b.url from Book b where b.user.userId = :userId")
    List<String> findByUrl(@Param("userId") String userId);

    @Query(value = "select b from Book b where b.user.userId = :userId")
    List<Book> findByBook(@Param("userId") String userId);

    @Query(value = "select b from Book b where b.user.userId = :userId and b.originName = :originName")
    Book findByOrOriginNameAndUser(@Param("userId") String userId, @Param("originName") String originName);



}
