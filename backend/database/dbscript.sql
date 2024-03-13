USE [master]
GO
/****** Object:  Database [Dwellow]    Script Date: 3/12/2024 4:19:21 PM ******/
CREATE DATABASE [Dwellow]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Dwellow', FILENAME = N'/var/opt/mssql/data/Dwellow.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Dwellow_log', FILENAME = N'/var/opt/mssql/data/Dwellow_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Dwellow] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Dwellow].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Dwellow] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Dwellow] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Dwellow] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Dwellow] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Dwellow] SET ARITHABORT OFF 
GO
ALTER DATABASE [Dwellow] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Dwellow] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Dwellow] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Dwellow] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Dwellow] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Dwellow] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Dwellow] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Dwellow] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Dwellow] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Dwellow] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Dwellow] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Dwellow] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Dwellow] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Dwellow] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Dwellow] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Dwellow] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Dwellow] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Dwellow] SET RECOVERY FULL 
GO
ALTER DATABASE [Dwellow] SET  MULTI_USER 
GO
ALTER DATABASE [Dwellow] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Dwellow] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Dwellow] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Dwellow] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Dwellow] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Dwellow] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Dwellow', N'ON'
GO
ALTER DATABASE [Dwellow] SET QUERY_STORE = OFF
GO
USE [Dwellow]
GO
/****** Object:  UserDefinedFunction [dbo].[IsAdmin]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create a function to check if a user is an admin
CREATE FUNCTION [dbo].[IsAdmin] (@user_id INT)
RETURNS BIT
AS
BEGIN
    DECLARE @is_admin BIT
    SELECT @is_admin = CASE WHEN EXISTS (SELECT 1 FROM users WHERE user_id = @user_id AND user_type = 'admin') THEN 1 ELSE 0 END
    RETURN @is_admin
END;
GO
/****** Object:  UserDefinedFunction [dbo].[IsTenant]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[IsTenant] (@user_id INT)
RETURNS BIT
AS
BEGIN
    DECLARE @is_tenant BIT
    SELECT @is_tenant = CASE WHEN EXISTS (SELECT 1 FROM users WHERE user_id = @user_id AND user_type = 'tenant') THEN 1 ELSE 0 END
    RETURN @is_tenant
END;
GO
/****** Object:  Table [dbo].[announcements]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[announcements](
	[announcement_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[announcement_text] [nvarchar](max) NOT NULL,
	[announcement_date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[announcement_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comments]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comments](
	[comment_id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[comment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contracts]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contracts](
	[contract_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[contract_text] [nvarchar](max) NOT NULL,
	[contract_date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[contract_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[notifications]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[notifications](
	[notification_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[notification_text] [nvarchar](max) NOT NULL,
	[notification_date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[notification_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[properties]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[properties](
	[property_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[property_name] [nvarchar](100) NOT NULL,
	[property_address] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[property_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[services]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[services](
	[service_id] [int] IDENTITY(1,1) NOT NULL,
	[service_type] [nvarchar](50) NOT NULL,
	[property_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tickets](
	[ticket_id] [int] IDENTITY(1,1) NOT NULL,
	[unit_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[units]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[units](
	[unit_id] [int] IDENTITY(1,1) NOT NULL,
	[property_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[unit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 3/12/2024 4:19:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[user_type] [varchar](20) NOT NULL,
	[username] [varchar](50) NOT NULL,
	[password] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[full_name] [varchar](100) NOT NULL,
	[date_of_birth] [date] NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[announcements]  WITH CHECK ADD  CONSTRAINT [FK_Announcements_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[announcements] CHECK CONSTRAINT [FK_Announcements_Users]
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Tickets] FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([ticket_id])
GO
ALTER TABLE [dbo].[comments] CHECK CONSTRAINT [FK_Comments_Tickets]
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[comments] CHECK CONSTRAINT [FK_Comments_Users]
GO
ALTER TABLE [dbo].[contracts]  WITH CHECK ADD  CONSTRAINT [FK_Contracts_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[contracts] CHECK CONSTRAINT [FK_Contracts_Users]
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[properties]  WITH CHECK ADD  CONSTRAINT [FK_Properties_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[properties] CHECK CONSTRAINT [FK_Properties_Users]
GO
ALTER TABLE [dbo].[services]  WITH CHECK ADD  CONSTRAINT [FK_Services_Properties] FOREIGN KEY([property_id])
REFERENCES [dbo].[properties] ([property_id])
GO
ALTER TABLE [dbo].[services] CHECK CONSTRAINT [FK_Services_Properties]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [FK_Tickets_Units] FOREIGN KEY([unit_id])
REFERENCES [dbo].[units] ([unit_id])
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [FK_Tickets_Units]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [FK_Tickets_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [FK_Tickets_Users]
GO
ALTER TABLE [dbo].[units]  WITH CHECK ADD  CONSTRAINT [FK_Units_Properties] FOREIGN KEY([property_id])
REFERENCES [dbo].[properties] ([property_id])
GO
ALTER TABLE [dbo].[units] CHECK CONSTRAINT [FK_Units_Properties]
GO
ALTER TABLE [dbo].[units]  WITH CHECK ADD  CONSTRAINT [FK_Units_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[units] CHECK CONSTRAINT [FK_Units_Users]
GO
ALTER TABLE [dbo].[announcements]  WITH CHECK ADD  CONSTRAINT [CHK_Announcements_UserType] CHECK  (([dbo].[IsAdmin]([user_id])=(1)))
GO
ALTER TABLE [dbo].[announcements] CHECK CONSTRAINT [CHK_Announcements_UserType]
GO
ALTER TABLE [dbo].[contracts]  WITH CHECK ADD  CONSTRAINT [CHK_Contracts_UserType] CHECK  (([dbo].[IsTenant]([user_id])=(1)))
GO
ALTER TABLE [dbo].[contracts] CHECK CONSTRAINT [CHK_Contracts_UserType]
GO
ALTER TABLE [dbo].[properties]  WITH CHECK ADD  CONSTRAINT [CHK_Properties_UserType] CHECK  (([dbo].[IsAdmin]([user_id])=(1)))
GO
ALTER TABLE [dbo].[properties] CHECK CONSTRAINT [CHK_Properties_UserType]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_Tickets_UserType] CHECK  (([dbo].[IsTenant]([user_id])=(1)))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_Tickets_UserType]
GO
ALTER TABLE [dbo].[units]  WITH CHECK ADD  CONSTRAINT [CHK_Units_UserType] CHECK  (([dbo].[IsTenant]([user_id])=(1)))
GO
ALTER TABLE [dbo].[units] CHECK CONSTRAINT [CHK_Units_UserType]
GO
USE [master]
GO
ALTER DATABASE [Dwellow] SET  READ_WRITE 
GO
