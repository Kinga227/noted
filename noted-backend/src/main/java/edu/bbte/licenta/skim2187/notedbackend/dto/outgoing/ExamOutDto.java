package edu.bbte.licenta.skim2187.notedbackend.dto.outgoing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamOutDto {

    private Long id;

    private Instant date;

    private String title;

    private String description;
}
