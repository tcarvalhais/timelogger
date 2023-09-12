using System;

namespace Timelogger.DTOS
{
	public class ProjectDTO
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public double CreationDateTimestamp { get; set; }
		public double DeadlineDateTimestamp { get; set; }
		public Status ProjectStatus { get; set; }
	}
}
