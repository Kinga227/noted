package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.Note;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface NoteRepository extends JpaRepository<Note, Long> {

    Collection<Note> findByUser(User user);
}
