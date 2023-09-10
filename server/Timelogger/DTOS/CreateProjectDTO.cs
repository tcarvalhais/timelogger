namespace Timelogger.DTOS
{
	public class CreateProjectDTO
	{
		public string Name { get; set; }
		public double CreationDateTimestamp { get; set; }
		public double DeadlineDateTimestamp { get; set; }
	}
}
