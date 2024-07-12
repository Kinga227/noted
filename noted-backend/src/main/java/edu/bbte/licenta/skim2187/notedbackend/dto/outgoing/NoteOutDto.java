package edu.bbte.licenta.skim2187.notedbackend.dto.outgoing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteOutDto {

    private Long id;

    private Integer weekNumber;

    private String description;

    private Boolean done;
}
