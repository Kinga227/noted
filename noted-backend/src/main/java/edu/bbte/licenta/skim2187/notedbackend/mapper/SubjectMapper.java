package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.SubjectInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.SubjectOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class SubjectMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Subject mapToEntity(SubjectInDto createRequestDto);

    public abstract SubjectOutDto mapToDto(Subject createRequest);
}
