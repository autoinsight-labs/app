import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/lib/contexts/auth'
import {
  acceptInvite,
  listInvitesByEmail,
  listInvitesByYard,
  rejectInvite,
} from '@/lib/services/invites'
import { listYardEmployees } from '@/lib/services/yard-employees'
import { getYard, listYards } from '@/lib/services/yards'
import type { EmployeeInvite, Yard, YardEmployee } from '@/lib/types'
import { cn, getInitials } from '@/utils/utils'
import { Check, Pencil, Trash2, UserPlus, X } from 'lucide-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
import type { CreateYardSheetRef } from './components/create-yard-sheet'
import { CreateYardSheet } from './components/create-yard-sheet'
import { DeleteYardSheet } from './components/delete-yard-sheet'
import type { EditYardSheetRef } from './components/edit-yard-sheet'
import { EditYardSheet } from './components/edit-yard-sheet'
import type { InviteUserSheetRef } from './components/invite-user-sheet'
import { InviteUserSheet } from './components/invite-user-sheet'

function Skeleton({ className }: { className?: string }) {
  return (
    <View
      className={cn('overflow-hidden rounded-md bg-muted/40', className)}
      style={{}}
    />
  )
}

const PAGE_SIZE = 10

export default function YardsEntryScreen() {
  const inviteSheetRef = useRef<InviteUserSheetRef>(null)
  const editSheetRef = useRef<EditYardSheetRef>(null)
  const createSheetRef = useRef<CreateYardSheetRef>(null)
  const { user } = useAuth()
  const [checking, setChecking] = useState(true)

  const [yard, setYard] = useState<Yard | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [employees, setEmployees] = useState<YardEmployee[]>([])
  const [empPage, setEmpPage] = useState(1)
  const [empHasMore, setEmpHasMore] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)

  const [invites, setInvites] = useState<EmployeeInvite[]>([])
  const [loadingInvites, setLoadingInvites] = useState(false)
  const [inviteActioning, setInviteActioning] = useState<string | null>(null)

  const [personalInvites, setPersonalInvites] = useState<EmployeeInvite[]>([])
  const [loadingPersonalInvites, setLoadingPersonalInvites] = useState(false)
  const [personalInvitesYards, setPersonalInvitesYards] = useState<
    Record<string, Yard | null>
  >({})

  const computeAdmin = useCallback(
    async (y: Yard, currentUserId?: string | null) => {
      if (!currentUserId) {
        setIsAdmin(false)
        return
      }
      const owner = currentUserId === y.ownerId
      let hasAdminMembership = false
      try {
        const emp = await listYardEmployees({
          yardId: y.id,
          pageNumber: 1,
          pageSize: 100,
        })
        hasAdminMembership = !!emp.data.find(
          e => e.userId === currentUserId && e.role === 'ADMIN'
        )
      } catch {}
      setIsAdmin(owner || hasAdminMembership)
    },
    []
  )

  const checkMyYards = useCallback(async () => {
    if (!user?.uid) return
    try {
      setChecking(true)
      let page = 1
      let found: Yard | null = null
      while (!found) {
        const res = await listYards({ pageNumber: page, pageSize: PAGE_SIZE })
        for (const y of res.data) {
          if (y.ownerId === user.uid) {
            found = y
            break
          }
          try {
            const emp = await listYardEmployees({
              yardId: y.id,
              pageNumber: 1,
              pageSize: 1,
            })
            if (emp.data.some(e => e.userId === user.uid)) {
              found = y
              break
            }
          } catch {}
        }
        if (found) break
        if (page >= res.totalPages) break
        page += 1
      }
      if (found) {
        const detail = await getYard(found.id)
        setYard(detail)
        await computeAdmin(detail, user.uid)
      } else {
        setYard(null)
      }
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível verificar seu pátio')
    } finally {
      setChecking(false)
    }
  }, [user?.uid, computeAdmin])

  const loadEmployees = useCallback(
    async (page = 1, append = false) => {
      if (!yard) return
      try {
        setLoadingEmployees(true)
        const res = await listYardEmployees({
          yardId: yard.id,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        })
        setEmpHasMore(page < res.totalPages)
        setEmpPage(res.pageNumber)
        setEmployees(prev => (append ? [...prev, ...res.data] : res.data))
      } catch (e) {
        const err = e as { message?: string }
        toast.error(err.message ?? 'Não foi possível carregar funcionários')
      } finally {
        setLoadingEmployees(false)
      }
    },
    [yard]
  )

  const loadYardInvites = useCallback(async () => {
    if (!yard) return
    try {
      setLoadingInvites(true)
      const res = await listInvitesByYard(yard.id, {
        pageNumber: 1,
        pageSize: 50,
      })
      setInvites(res.data.filter(i => i.status === 'PENDING'))
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível carregar convites')
    } finally {
      setLoadingInvites(false)
    }
  }, [yard])

  const loadPersonalInvites = useCallback(async () => {
    if (yard || !user?.email) return
    try {
      setLoadingPersonalInvites(true)
      const res = await listInvitesByEmail(user.email)
      const pending = res.data.filter(i => i.status === 'PENDING')
      setPersonalInvites(pending)
      const uniqueYardIds = Array.from(new Set(pending.map(i => i.yardId)))
      if (uniqueYardIds.length) {
        const results = await Promise.allSettled(
          uniqueYardIds.map(id => getYard(id))
        )
        const dict: Record<string, Yard | null> = {}
        results.forEach((r, idx) => {
          const yid = uniqueYardIds[idx]
          dict[yid] =
            r.status === 'fulfilled'
              ? (r as PromiseFulfilledResult<Yard>).value
              : null
        })
        setPersonalInvitesYards(dict)
      } else {
        setPersonalInvitesYards({})
      }
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível carregar convites')
    } finally {
      setLoadingPersonalInvites(false)
    }
  }, [yard, user?.email])

  useEffect(() => {
    checkMyYards()
  }, [checkMyYards])

  useEffect(() => {
    if (yard) {
      loadEmployees(1, false)
      loadYardInvites()
    } else {
      setEmployees([])
      setInvites([])
      loadPersonalInvites()
    }
  }, [yard, loadEmployees, loadYardInvites, loadPersonalInvites])

  async function handleAccept(invite: EmployeeInvite) {
    try {
      setInviteActioning(invite.token)
      await acceptInvite(invite.token, { userId: String(user?.uid) })
      toast.success('Convite aceito!')
      await checkMyYards()
      if (yard) {
        await Promise.all([loadEmployees(1, false), loadYardInvites()])
      } else {
        await loadPersonalInvites()
      }
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível aceitar o convite')
      if ((err.message || '').toLowerCase().includes('token')) {
        setInvites(prev => prev.filter(i => i.token !== invite.token))
        setPersonalInvites(prev => prev.filter(i => i.token !== invite.token))
      }
    } finally {
      setInviteActioning(null)
    }
  }

  async function handleReject(invite: EmployeeInvite) {
    try {
      setInviteActioning(invite.token)
      await rejectInvite(invite.token)
      toast.success('Convite recusado!')
      setInvites(prev => prev.filter(i => i.token !== invite.token))
      setPersonalInvites(prev => prev.filter(i => i.token !== invite.token))
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível recusar o convite')
    } finally {
      setInviteActioning(null)
    }
  }

  const deleteSheetRef = useRef<{
    open: (id: string) => void
    close: () => void
  } | null>(null)
  const openDelete = () => {
    if (!yard) return
    deleteSheetRef.current?.open(yard.id)
  }

  if (checking) {
    return (
      <SafeAreaView className="flex-1 px-6 py-8">
        <View className="gap-6">
          <Skeleton className="h-8 w-40" />
          <View className="gap-3">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-52" />
          </View>
          <View className="flex-row gap-3">
            <Skeleton className="h-16 flex-1" />
            <Skeleton className="h-16 flex-1" />
          </View>
          <View className="gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (!yard) {
    const noInvites = !loadingPersonalInvites && personalInvites.length === 0
    return (
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6 py-8">
          <View className="w-full items-start mb-6">
            <Text className="text-3xl font-semibold">Pátio</Text>
          </View>
          <View
            className={cn(
              'mt-4 gap-3',
              noInvites && 'flex-1 justify-center items-center'
            )}
          >
            <View className={cn('items-center', noInvites && 'justify-center')}>
              <Text className="text-xl font-semibold">
                Nenhum pátio encontrado.
              </Text>
              <Text className="text-muted-foreground text-center">
                Crie um pátio para começar a gerenciar sua operação
                {personalInvites.length > 0 && ' ou aceite um convite abaixo.'}
              </Text>
              <Button
                className="mt-4"
                onPress={() => createSheetRef.current?.open()}
              >
                <Text className="text-primary-foreground">Criar pátio</Text>
              </Button>
            </View>
            {!noInvites && (
              <View className="mt-10">
                {loadingPersonalInvites ? (
                  <View className="gap-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </View>
                ) : (
                  personalInvites.length > 0 && (
                    <View className="gap-4">
                      <Text className="text-lg font-semibold">
                        Convites pendentes
                      </Text>
                      {personalInvites.map(inv => {
                        const acting = inviteActioning === inv.token
                        const yardDetail = personalInvitesYards[inv.yardId]
                        return (
                          <View
                            key={inv.id}
                            className="rounded-2xl border border-border bg-card/40 p-4 gap-2"
                          >
                            {yardDetail ? (
                              <View className="flex-row justify-between items-center gap-4">
                                <View className="flex-1 pr-4">
                                  <Text className="font-semibold">
                                    {yardDetail.address.neighborhood}
                                  </Text>
                                  <Text className="text-muted-foreground text-xs mt-0.5">
                                    {yardDetail.address.city} -{' '}
                                    {yardDetail.address.state} • CEP{' '}
                                    {yardDetail.address.zipCode}
                                  </Text>
                                </View>
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5"
                                >
                                  <Text className="text-[10px] font-semibold">
                                    {inv.role.slice(0, 1).toUpperCase() +
                                      inv.role.slice(1).toLowerCase()}
                                  </Text>
                                </Badge>
                              </View>
                            ) : (
                              <View className="gap-2">
                                <Skeleton className="h-4 w-52" />
                                <Skeleton className="h-3 w-40" />
                              </View>
                            )}
                            <View className="flex-row gap-3 mt-2 justify-end">
                              <Button
                                variant="secondary"
                                disabled={acting}
                                onPress={() => handleReject(inv)}
                                size="sm"
                              >
                                <Text>Recusar</Text>
                              </Button>
                              <Button
                                disabled={acting}
                                onPress={() => handleAccept(inv)}
                                size="sm"
                              >
                                <Text>Aceitar</Text>
                              </Button>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        </ScrollView>
        <CreateYardSheet
          ref={createSheetRef}
          onCreated={async created => {
            setYard(created)
            await computeAdmin(created, user?.uid)
            await loadEmployees(1, false)
            await loadYardInvites()
          }}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-3xl font-semibold">
                {yard.address.neighborhood}
              </Text>
              <Text className="text-muted-foreground mt-1">
                {yard.address.city} - {yard.address.state} •{' '}
                {yard.address.zipCode}
              </Text>
            </View>
            {isAdmin && (
              <View className="rounded-full bg-card border border-border flex-row items-center px-2 py-1.5 gap-1">
                <Pressable
                  onPress={() => editSheetRef.current?.open()}
                  className="size-9 rounded-full items-center justify-center"
                >
                  <Pencil size={18} color="#94A3B8" />
                </Pressable>
                <Pressable
                  onPress={() => inviteSheetRef.current?.open()}
                  className="size-9 rounded-full items-center justify-center"
                >
                  <UserPlus size={18} color="#94A3B8" />
                </Pressable>
                <View className="w-px h-6 bg-border mx-0.5" />
                <Pressable
                  onPress={openDelete}
                  className="size-9 rounded-full items-center justify-center bg-destructive"
                >
                  <Trash2 size={18} color="#F7FBFE" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {loadingInvites ? (
          <View className="mb-8 gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </View>
        ) : invites.length > 0 ? (
          <View className="mb-8 gap-4">
            <Text className="text-lg font-semibold">Convites pendentes</Text>
            {invites.map(inv => {
              const acting = inviteActioning === inv.token
              const canAct = inv.email === user?.email
              const initials = getInitials(inv.name || 'NA')
              return (
                <View
                  key={inv.id}
                  className="rounded-2xl border border-border bg-card/40 p-4 opacity-60"
                >
                  <View className="flex-row justify-between items-center gap-4">
                    <View className="size-12 rounded-full bg-muted items-center justify-center">
                      <Text className="font-semibold">{initials}</Text>
                    </View>
                    <View className="flex-1 w-full justify-center">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-medium">{inv.name}</Text>
                          <Text className="text-muted-foreground text-sm">
                            {inv.email}
                          </Text>
                        </View>
                        <Badge variant="secondary" className="ml-1 px-2 py-0.5">
                          <Text className="text-[10px] font-semibold">
                            {inv.role.slice(0, 1).toUpperCase() +
                              inv.role.slice(1).toLowerCase()}
                          </Text>
                        </Badge>
                      </View>
                    </View>
                    {canAct && (
                      <View className="flex-row gap-2">
                        <Pressable
                          disabled={acting}
                          onPress={() => handleAccept(inv)}
                          className={cn(
                            'w-9 h-9 rounded-full items-center justify-center bg-primary active:opacity-85',
                            acting && 'opacity-60'
                          )}
                        >
                          {acting ? (
                            <ActivityIndicator size="small" />
                          ) : (
                            <Check
                              size={18}
                              className="text-primary-foreground"
                            />
                          )}
                        </Pressable>
                        <Pressable
                          disabled={acting}
                          onPress={() => handleReject(inv)}
                          className={cn(
                            'w-9 h-9 rounded-full items-center justify-center bg-secondary active:opacity-85',
                            acting && 'opacity-60'
                          )}
                        >
                          {acting ? (
                            <ActivityIndicator size="small" />
                          ) : (
                            <X size={18} className="text-foreground" />
                          )}
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        ) : null}

        <View className="gap-4">
          <Text className="text-lg font-semibold">Funcionários</Text>
          {loadingEmployees && employees.length === 0 ? (
            <View className="gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </View>
          ) : employees.length === 0 ? (
            <Text className="text-muted-foreground">
              Nenhum funcionário ainda.
            </Text>
          ) : (
            <FlatList
              data={employees}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const initials = getInitials(item.name || 'NA')
                return (
                  <Pressable className="flex-row items-center gap-4 rounded-2xl border border-border px-4 py-3 active:opacity-80 bg-card/40 mb-3">
                    <View className="flex-row justify-between items-center gap-4">
                      <View className="size-12 rounded-full bg-muted items-center justify-center">
                        <Text className="font-semibold">{initials}</Text>
                      </View>
                      <View className="flex-1 w-full justify-center">
                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="font-medium">{item.name}</Text>
                            <Text className="text-muted-foreground text-sm">
                              {item.userId.slice(0, 20)}...
                            </Text>
                          </View>
                          <Badge
                            variant="secondary"
                            className="ml-1 px-2 py-0.5"
                          >
                            <Text className="text-[10px] font-semibold">
                              {item.role.slice(0, 1).toUpperCase() +
                                item.role.slice(1).toLowerCase()}
                            </Text>
                          </Badge>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )
              }}
              scrollEnabled={false}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!loadingEmployees && empHasMore) {
                  loadEmployees(empPage + 1, true)
                }
              }}
              ListFooterComponent={
                loadingEmployees && empHasMore ? (
                  <View className="py-2 items-center">
                    <ActivityIndicator size="small" />
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </ScrollView>
      {yard && (
        <>
          <InviteUserSheet
            ref={inviteSheetRef}
            yardId={yard.id}
            onInvited={async () => {
              await loadYardInvites()
            }}
          />
          <EditYardSheet
            ref={editSheetRef}
            yardId={yard.id}
            onUpdated={async updated => {
              setYard(updated)
              await loadEmployees(1, false)
            }}
          />
          <DeleteYardSheet
            ref={deleteSheetRef}
            onDeleted={async () => {
              setYard(null)
            }}
          />
        </>
      )}
    </SafeAreaView>
  )
}
