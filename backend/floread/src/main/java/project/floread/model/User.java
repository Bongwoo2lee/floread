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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    //생성
    @Builder
    public User(String name, String email, String userId, Role role) {
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.role = role;
    }

    //업데이트
    public User update(String name, String userId) {
        this.name = name;
        this.userId = userId;

        return this;
    }

    //역할 가져오기
    public String getRoleKey() {
        return this.role.getKey();
    }
}
