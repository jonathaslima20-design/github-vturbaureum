import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Ban, CircleCheck as CheckCircle, MessageCircle, ExternalLink, MoreHorizontal, AlertCircle, Image, Key, ArrowRightLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials, formatWhatsAppForDisplay } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PlanStatusBadge from '@/components/subscription/PlanStatusBadge';
import PlanTypeBadge from '@/components/subscription/PlanTypeBadge';
import type { User } from '@/types';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { EditImageLimitDialog } from './EditImageLimitDialog';
import { generateWhatsAppUrl } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onSelectUser: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleBlock: (userId: string, currentBlocked: boolean) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  loading: boolean;
  currentUserRole: string;
}

export function UserTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onToggleBlock,
  onDeleteUser,
  loading,
  currentUserRole
}: UserTableProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<{ id: string; name: string } | null>(null);
  const [showImageLimitDialog, setShowImageLimitDialog] = useState(false);
  const [selectedUserForImageLimit, setSelectedUserForImageLimit] = useState<{ id: string; name: string; currentLimit: number } | null>(null);

  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));
  const someSelected = selectedUsers.size > 0 && !allSelected;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary">Administrador</Badge>;
      case 'parceiro':
        return <Badge className="bg-blue-500">Parceiro</Badge>;
      case 'corretor':
        return <Badge variant="secondary">Vendedor</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleCloneUser = (userId: string) => {
    // Dispatch custom event to open clone dialog
    const event = new CustomEvent('openCloneUserDialog', {
      detail: { targetUserId: userId }
    });
    window.dispatchEvent(event);
  };

  const handleCopyProducts = (userId: string) => {
    // Dispatch custom event to open copy products dialog
    const event = new CustomEvent('openCopyProducts', {
      detail: { targetUserId: userId }
    });
    window.dispatchEvent(event);
  };

  const handleChangePassword = (userId: string, userName: string) => {
    setSelectedUserForPassword({ id: userId, name: userName });
    setShowPasswordDialog(true);
  };

  const handleEditImageLimit = (userId: string, userName: string, currentLimit: number) => {
    setSelectedUserForImageLimit({ id: userId, name: userName, currentLimit });
    setShowImageLimitDialog(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
          <p className="text-muted-foreground">
            Não há usuários que correspondam aos filtros selecionados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    aria-label="Selecionar todos"
                    className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                  />
                </TableHead>
                <TableHead className="min-w-[220px]">Usuário</TableHead>
                <TableHead className="w-28">Plano</TableHead>
                <TableHead className="w-24">Vencimento</TableHead>
                <TableHead className="w-12 text-center">WhatsApp</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-24">Cadastro</TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={selectedUsers.has(user.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
                      aria-label={`Selecionar ${user.name}`}
                    />
                  </TableCell>
                  
                  <TableCell className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-28">
                    <div className="truncate">
                      <PlanTypeBadge billingCycle={user.billing_cycle} />
                    </div>
                  </TableCell>

                  <TableCell className="w-24">
                    {user.next_payment_date ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              <span className="text-xs">
                                {format(new Date(user.next_payment_date), 'dd/MM', { locale: ptBR })}
                              </span>
                              {(() => {
                                const expirationDate = new Date(user.next_payment_date);
                                const now = new Date();
                                const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                if (daysUntilExpiration < 0) {
                                  return <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />;
                                } else if (daysUntilExpiration <= 7) {
                                  return <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />;
                                }
                                return null;
                              })()}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {(() => {
                              const expirationDate = new Date(user.next_payment_date!);
                              const now = new Date();
                              const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                              if (daysUntilExpiration < 0) {
                                return `Vencido há ${Math.abs(daysUntilExpiration)} dia(s)`;
                              } else if (daysUntilExpiration === 0) {
                                return 'Vence hoje';
                              }
                              return `Vence em ${daysUntilExpiration} dia(s)`;
                            })()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell className="w-12 text-center">
                    {user.whatsapp ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700"
                              asChild
                            >
                              <a
                                href={generateWhatsAppUrl(user.whatsapp, `Olá ${user.name}, sou da equipe VitrineTurbo. Como posso ajudar?`, user.country_code || '55')}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatWhatsAppForDisplay(user.whatsapp, user.country_code || '55')}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="w-20">
                    {user.is_blocked ? (
                      <Badge variant="destructive" className="text-xs">Bloqueado</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-xs">Ativo</Badge>
                    )}
                  </TableCell>

                  <TableCell className="w-24">
                    <div className="text-xs">
                      {format(new Date(user.created_at), 'dd/MM/yy', { locale: ptBR })}
                    </div>
                  </TableCell>
                  
                  <TableCell className="w-20">
                    <div className="flex justify-end gap-1">
                      {/* View Profile */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <Link to={`/admin/users/${user.id}`} title="Ver perfil">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      {/* Block/Unblock */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onToggleBlock(user.id, user.is_blocked)}
                        title={user.is_blocked ? "Desbloquear" : "Bloquear"}
                      >
                        {user.is_blocked ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Ban className="h-4 w-4 text-red-600" />
                        )}
                      </Button>

                      {/* More Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Mais ações"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {/* View Storefront */}
                          {user.slug && (
                            <DropdownMenuItem asChild>
                              <a
                                href={`/${user.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Ver loja do cliente
                              </a>
                            </DropdownMenuItem>
                          )}

                          {/* Admin-only actions */}
                          {currentUserRole === 'admin' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEditImageLimit(user.id, user.name, user.max_images_per_product || 10)}
                              >
                                <Image className="h-4 w-4 mr-2" />
                                Limite de imagens
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleChangePassword(user.id, user.name)}
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Alterar senha
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleCopyProducts(user.id)}
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Copiar produtos
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleCloneUser(user.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Clonar usuário
                              </DropdownMenuItem>

                              {/* Delete User - Only for admins and only non-admin users */}
                              {user.role !== 'admin' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/10 focus:bg-destructive/10 text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Excluir usuário
                                    </div>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir o usuário "{user.name}"?
                                        Esta ação não pode ser desfeita e todos os dados do usuário serão removidos.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onDeleteUser(user.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        userId={selectedUserForPassword?.id || ''}
        userName={selectedUserForPassword?.name || ''}
      />

      {/* Edit Image Limit Dialog */}
      <EditImageLimitDialog
        open={showImageLimitDialog}
        onOpenChange={setShowImageLimitDialog}
        userId={selectedUserForImageLimit?.id || ''}
        userName={selectedUserForImageLimit?.name || ''}
        currentLimit={selectedUserForImageLimit?.currentLimit || 10}
      />
    </Card>
  );
}