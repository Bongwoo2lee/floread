package project.floread.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


public class UserAdapter extends User {

    private project.floread.model.User user;

    public UserAdapter(project.floread.model.User user) {
        super(user.getName(), user.getEmail(), List.of(new SimpleGrantedAuthority("GUEST")));
        this.user = user;
    }


}
