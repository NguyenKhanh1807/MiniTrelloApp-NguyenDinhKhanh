import { useInvitations } from '../hooks/useInvitations';

function Invitations() {
  const { invites, respond } = useInvitations();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Board Invitations</h2>

      {invites.length === 0 ? (
        <p className="text-gray-500">No invitations found.</p>
      ) : (
        <ul className="space-y-4">
          {invites.map(invite => (
            <li key={invite.id} className="border p-4 rounded bg-gray-50 shadow-sm">
              <p><strong>Board ID:</strong> {invite.board_id}</p>
              <p><strong>Invited By:</strong> {invite.board_owner_id}</p>
              <p><strong>Status:</strong> {invite.status}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => respond(invite.id, invite.board_id, 'accepted')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(invite.id, invite.board_id, 'declined')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Invitations;