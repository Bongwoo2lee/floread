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
public class ResponseDTO<T> {
    //http 응답에 사용할때 사용
    //자바 generic를 사용하여 재사용성을 높임
    private String error;
    private List<T> data;
}
