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
    private String profile_image;

    public RequestUser(String id, String name, String email, String profile_image) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profile_image = profile_image;
    }
}
