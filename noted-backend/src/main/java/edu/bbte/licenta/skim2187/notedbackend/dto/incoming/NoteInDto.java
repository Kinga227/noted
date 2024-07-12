package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteInDto {

    @NotNull
    private Integer weekNumber;

    private String description;

    private Boolean done;
}
