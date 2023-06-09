package project.floread;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.io.File;
import java.util.Arrays;

@SpringBootApplication
@EnableJpaAuditing
public class FloreadApplication {

	public static void main(String[] args) {
		SpringApplication.run(FloreadApplication.class, args);
		String currentUrl = System.getProperty("user.dir");
		File currentFolder = new File(currentUrl);
		File parentFolder = currentFolder.getParentFile();
		String bookUrl = parentFolder.getAbsolutePath()+"/book/";
		File targetFolder = new File(bookUrl);
		File[] files = targetFolder.listFiles();
		for (File file : files) {
			file.delete();
		}
	}
	//실행시 book폴더에 있는 내용 초기화
	
}
