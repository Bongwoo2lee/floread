package project.floread.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class RequestUser {
    private String id;
    private String name;
    private String email;

    public RequestUser(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
