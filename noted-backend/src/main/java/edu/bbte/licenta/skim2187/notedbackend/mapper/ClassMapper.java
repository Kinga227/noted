package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ClassInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ClassOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Class;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ClassMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Class mapToEntity(ClassInDto createRequestDto);

    @Mapping(target = "subjectId", source = "subject.id")
    public abstract ClassOutDto mapToDto(Class createRequest);
}
