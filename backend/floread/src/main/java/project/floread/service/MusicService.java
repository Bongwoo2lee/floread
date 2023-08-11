package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Book;
import project.floread.model.Emotion;
import project.floread.model.Music;
import project.floread.model.User;
import project.floread.repository.EmotionRepository;
import project.floread.repository.MusicEmotionRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MusicService {

    private final MusicEmotionRepository musicEmotionRepository;

    @Transactional
    public List<String> findByMusic(Emotion emotion) {
        List<String> urls = new ArrayList<>();
        List<Music> musics = musicEmotionRepository.findByMusic(emotion);
        for (Music music : musics) {
            String url = musicEmotionRepository.findByUrl(music.getId());
            urls.add(url);
        }

        return urls;
    }
}
