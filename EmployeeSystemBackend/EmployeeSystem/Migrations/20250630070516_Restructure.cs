using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeSystem.Migrations
{
    /// <inheritdoc />
    public partial class Restructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isActive",
                table: "Employees");

            migrationBuilder.AddColumn<int>(
                name: "employeeId",
                table: "Logins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "Logins",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Logins_employeeId",
                table: "Logins",
                column: "employeeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins",
                column: "employeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins");

            migrationBuilder.DropIndex(
                name: "IX_Logins_employeeId",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "employeeId",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "isActive",
                table: "Logins");

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "Employees",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
