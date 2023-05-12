package project.floread.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;


    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String userId;

    @OneToMany(mappedBy = "user")
    private List<Book> bookList = new ArrayList<>();

    //생성
    @Builder
    public User(String name, String email, String userId) {
        this.name = name;
        this.email = email;
        this.userId = userId;
    }

    //업데이트
    public User update(String name, String userId) {
        this.name = name;
        this.userId = userId;

        return this;
    }

}
