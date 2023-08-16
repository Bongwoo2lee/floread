package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.floread.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "select u from User u where u.userId = :userId")
    User findByUserId(@Param("userId") String userId);

    @Query(value = "select u from User u where u.name = :name")
    User findByName(@Param("name") String name);

    @Query(value = "select u from User u where u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    Boolean existsByName(String name);

}
