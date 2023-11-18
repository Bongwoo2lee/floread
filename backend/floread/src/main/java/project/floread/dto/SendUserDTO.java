package project.floread.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@Data
public class SendUserDTO {

    String userName;
    String email;

    public SendUserDTO(String userName, String email) {
        this.userName = userName;
        this.email = email;
    }
}
