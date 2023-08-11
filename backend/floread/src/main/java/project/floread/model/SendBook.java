package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;


public class SendBook implements Serializable {

    private String title;
    private String url;
    private List<String> emotions;

    public SendBook(String title, String url, List<String> emotions) {
        this.title = title;
        this.url = url;
        this.emotions = emotions;
    }


}
