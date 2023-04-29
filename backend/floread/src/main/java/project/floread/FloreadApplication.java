package project.floread;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FloreadApplication {

	public static void main(String[] args) {
		SpringApplication.run(FloreadApplication.class, args);
	}

}
