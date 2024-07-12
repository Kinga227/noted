package edu.bbte.licenta.skim2187.notedbackend.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointInDto {

    @NotNull
    private Double points;

    @NotNull
    private String typeName;

    private Double min;

    private Double max;

    @NotNull
    private Long subjectId;
}
