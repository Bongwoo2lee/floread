package project.floread.model;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;


public class SendBook implements Serializable {

    private String title;
    private String url;
    private List<SendMusicEmotion> musicEmotionList;

    public SendBook(String title, String url, List<SendMusicEmotion> musicEmotionList) {
        this.title = title;
        this.url = url;
        this.musicEmotionList = musicEmotionList;
    }

    @Override
    public String toString() {
        String musicTo = musicEmotionList.toString();

        return "SendBook{" +
                "title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", musicEmotionList=" + musicTo +
                '}';
    }
}
