package project.floread.config.auth.dto;

import lombok.Getter;
import project.floread.model.User;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;
    private String userId;

    public SessionUser(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.userId = user.getUserId();
    }
}
