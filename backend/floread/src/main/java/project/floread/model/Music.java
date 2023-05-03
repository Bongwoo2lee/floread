package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Music {

    @Id @GeneratedValue
    @Column(name = "music_id")
    private Long id;

    private String title;

    private String url;

    @OneToMany(mappedBy = "music", cascade = CascadeType.ALL)
    private List<MusicEmotion> musicEmotions;
}
