package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.ToDo;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface ToDoRepository extends JpaRepository<ToDo, Long> {

    Collection<ToDo> findByUser(User user);
}
