package project.floread.model;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;


public class SendMusicEmotion {

    private String emotion;
    private List<String> musicUrl;

    public SendMusicEmotion(String emotion, List<String> musicUrl) {
        this.emotion = emotion;
        this.musicUrl = musicUrl;
    }

    @Override
    public String toString() {
        String musicTo = musicUrl.toString();

        return "SendMusicEmotion{" +
                "emotion='" + emotion + '\'' +
                ", musicUrl=" + musicTo +
                '}';
    }
}
