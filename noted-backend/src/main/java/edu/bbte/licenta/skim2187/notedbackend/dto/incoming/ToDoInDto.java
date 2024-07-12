package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToDoInDto {

    @NotNull
    private Instant date;

    private String description;

    private Boolean done;

    private Long typeId;

    @Override
    public String toString() {
        return "ToDoInDto{" +
                "date=" + date.toString() +
                ", description='" + description + '\'' +
                ", done=" + done +
                ", typeId=" + typeId +
                '}';
    }
}