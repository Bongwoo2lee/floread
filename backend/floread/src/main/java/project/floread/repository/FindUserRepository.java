package project.floread.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import project.floread.model.User;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class FindUserRepository {

    private final EntityManager em;


    public User findByEmail(String email) {
        System.out.println(em.find(User.class, email));
        return em.find(User.class, email);
    }


}