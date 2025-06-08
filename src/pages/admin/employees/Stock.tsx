import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Download } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  telephone: z.string().min(10, "Invalid telephone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  ccp: z.string().min(5, "CCP must be at least 5 characters"),
  file: z.instanceof(File).optional(),
});

type StockEmployee = {
  id: string;
  first_name: string;
  last_name: string;
  telephone: string;
  address: string;
  email: string;
  ccp: string;
  file_url: string | null;
  code: string;
  role: string;
  created_at: string;
  updated_at: string;
};

// Helper to generate a unique 7-digit code for employees
async function generateUniqueEmployeeCode() {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(1000000 + Math.random() * 9000000).toString();
    const { data } = await supabase
      .from("employees")
      .select("id")
      .eq("code", code)
      .single();
    exists = !!data;
  }
  return code;
}

// Stock Employee Table Component
function StockEmployeeTable({ employees, loading, onEdit, onDelete, onDownload }: {
  employees: StockEmployee[];
  loading: boolean;
  onEdit: (emp: StockEmployee) => void;
  onDelete: (id: string) => void;
  onDownload: (fileUrl: string) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>CCP</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No stock employees found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell>
                  <div>{employee.telephone}</div>
                  <div className="text-sm text-gray-500">
                    {employee.email}
                  </div>
                </TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.ccp}</TableCell>
                <TableCell>{employee.code}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {employee.file_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(employee.file_url!)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(employee)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Employee Form Component
function EmployeeForm({
  form,
  onSubmit,
  editingEmployee,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  editingEmployee: StockEmployee | null;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ccp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>File (Word or PDF)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {editingEmployee ? "Update" : "Add"} Stock Employee
        </Button>
      </form>
    </Form>
  );
}

export default function Stock() {
  const [employees, setEmployees] = useState<StockEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<StockEmployee | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      telephone: "",
      address: "",
      email: "",
      ccp: "",
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (editingEmployee) {
      form.reset({
        first_name: editingEmployee.first_name,
        last_name: editingEmployee.last_name,
        telephone: editingEmployee.telephone,
        address: editingEmployee.address,
        email: editingEmployee.email,
        ccp: editingEmployee.ccp,
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        telephone: "",
        address: "",
        email: "",
        ccp: "",
      });
    }
  }, [editingEmployee, form]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("role", "stock")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch stock employees",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let fileUrl = editingEmployee?.file_url;

      if (values.file) {
        const fileExt = values.file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("employee-files")
          .upload(fileName, values.file);

        if (uploadError) throw uploadError;
        fileUrl = data.path;
      }

      if (editingEmployee) {
        const employeeData = {
          first_name: values.first_name,
          last_name: values.last_name,
          telephone: values.telephone,
          address: values.address,
          email: values.email,
          ccp: values.ccp,
          file_url: fileUrl,
          role: "stock",
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("employees")
          .update(employeeData)
          .eq("id", editingEmployee.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Stock employee updated successfully",
        });
      } else {
        const code = await generateUniqueEmployeeCode();
        const { error } = await supabase.from("employees").insert([
          {
            first_name: values.first_name,
            last_name: values.last_name,
            telephone: values.telephone,
            address: values.address,
            email: values.email,
            ccp: values.ccp,
            file_url: fileUrl,
            code,
            role: "stock",
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) throw error;
        toast({
          title: "Success",
          description: `Stock employee added with code ${code}`,
        });
      }

      setIsDialogOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save stock employee",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stock employee?")) return;

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEmployees(employees.filter((emp) => emp.id !== id));
      toast({
        title: "Success",
        description: "Stock employee deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete stock employee",
      });
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("employee-files")
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEmployee(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Stock Employee" : "Add New Stock Employee"}
              </DialogTitle>
            </DialogHeader>
            <EmployeeForm form={form} onSubmit={onSubmit} editingEmployee={editingEmployee} />
          </DialogContent>
        </Dialog>
      </div>
      <StockEmployeeTable
        employees={employees}
        loading={loading}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
    </div>
  );
}
