package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectInDto {

    private String name;

    private String gradingFormula;

    private Integer minutesSpent;
}
