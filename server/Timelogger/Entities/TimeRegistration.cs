using System;

namespace Timelogger.Entities
{
	public class TimeRegistration
	{
		public Guid Id { get; set; }
		public Guid ProjectId { get; set; }
		public double RegistrationTimestamp { get; set; }
		public int TimeMinutes { get; set; }
	}
}
