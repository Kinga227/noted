package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamInDto {

    @NotNull
    private Instant date;

    private String title;

    private String description;

    @Override
    public String toString() {
        return "ExamInDto{" +
                "date=" + date +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
