package edu.bbte.licenta.skim2187.notedbackend.dto.outgoing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointOutDto {

    private Long id;

    private Double points;

    private String typeName;

    private Double min;

    private Double max;
}
