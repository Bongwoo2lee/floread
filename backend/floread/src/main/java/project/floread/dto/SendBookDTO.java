package project.floread.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SendBookDTO {

    private SendUserDTO sendUserDTO;
    private List<BookDTO> bookList;


}
